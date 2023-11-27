import { join } from "node:path"
import { findFile } from "./utils/find-file.js"
import { date, time } from "./utils/datetime.js"
import { formatString } from "./utils/format-string.js"
import {
	cmd,
	configure,
	prepublish,
	publish,
	allActions,
} from "./actions/index.js"
import { sleep } from "./utils/sleep.js"
import { getConfig } from "./config/get-config.js"
import { ArgumentParser } from "./arguments-parser/index.js"
import { runInDirectory } from "./utils/run-in-directory.js"
import { loadDotenv } from "./utils/load-dotenv.js"

const parseConfig = async () => {
	const configFile = findFile(".deploy.json", process.cwd())
	const config = await getConfig(configFile)
	const projectFolder = join(configFile, "..")
	const directory = join(projectFolder, config.directory)
	return { config, directory, projectFolder }
}

const createParser = () => {
	const parser = new ArgumentParser("Deploy")
	parser.add("noPublish", Boolean, ["--no-publish", "-n"], "Don't publish")
	parser.add("isHelp", Boolean, ["--help", "-h", "/?"], "Show this message")
	return parser
}

/**
 * @param {string} tempFolder
 * @param {string[]} argv
 */
export const main = async (tempFolder, argv) => {
	const parser = createParser()
	const { isHelp, ...args } = parser.parse(argv)
	if (isHelp) return parser.help(args)
	const { noPublish } = args
	const { config, projectFolder, directory } = await parseConfig()
	const { predeploy_command } = config

	const ENV = {
		...process.env,
		...(await loadDotenv(join(projectFolder, ".env"))),
		DATE: date(),
		TIME: time(),
	}

	/** @param {string} string */
	const format = (string) => formatString(string, ENV)
	const predeploy = () =>
		runInDirectory(projectFolder, () => cmd(format(predeploy_command)))

	const params = { format, parent: tempFolder }

	/** @type {import("./actions/index.js").Action[]} */
	const actions = Object.entries(allActions)
		.filter(([key]) => key in config)
		.map(([key, action]) => action(config[key], params))

	console.log("Build...")
	await Promise.all([configure(actions), predeploy(), sleep(1000)])

	console.log("Copy...")
	await prepublish(actions, directory)

	if (noPublish) return
	console.log("Publish...")
	await publish(actions, directory)
}
