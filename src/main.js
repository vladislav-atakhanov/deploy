import { join } from "node:path"
import { findFile } from "./utils/find-file.js"
import { date, time } from "./utils/datetime.js"
import { formatString } from "./utils/format-string.js"
import { cmd, configure, git, prepublish, publish } from "./actions/index.js"
import { sleep } from "./utils/sleep.js"
import { getConfig } from "./config/get-config.js"

const parseConfig = async () => {
	const configFile = findFile(".deploy.json", process.cwd())
	const config = await getConfig(configFile)
	const projectFolder = join(configFile, "..")
	const directory = join(projectFolder, config.directory)
	return { config, directory, projectFolder }
}

/** @param {string} tempFolder */
export const main = async (tempFolder) => {
	const { config, projectFolder, directory } = await parseConfig()
	const { predeploy_command } = config

	const ENV = {
		DATE: date(),
		TIME: time(),
		NPM_RUN: `pnpm --prefix ${projectFolder} run`,
	}
	const predeploy = () => cmd(formatString(predeploy_command, ENV))

	/** @param {string} string */
	const format = (string) => formatString(string, ENV)

	/** @type {import("./actions/index.js").Action[]} */
	const actions = []

	const actionsTypes = { git }

	for (const type in actionsTypes) {
		if (type in config === false) continue
		actions.push(
			actionsTypes[type](config, {
				format,
				parent: tempFolder,
			})
		)
	}

	console.log("Build...")
	await Promise.all([configure(actions), predeploy(), sleep(1000)])

	console.log("Copy...")
	await prepublish(actions, directory)
	console.log("Publish...")
	await publish(actions, directory)
}
