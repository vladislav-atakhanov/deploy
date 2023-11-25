import { join } from "node:path"
import { findFile } from "./utils/find-file.js"
import { date, time } from "./utils/datetime.js"
import { format } from "./utils/format.js"
import { copyFolderContent } from "./utils/copy-folder-content.js"
import { cmd, git } from "./actions/index.js"
import { sleep } from "./utils/sleep.js"
import { getConfig } from "./config/get-config.js"

/** @param {string} tempFolder */
export const main = async (tempFolder) => {
	const configFile = findFile(".deploy.json", process.cwd())
	const projectFolder = join(configFile, "..")
	const config = await getConfig(configFile)
	const { predeploy_command } = config

	const directory = join(configFile, "..", config.directory)

	const ENV = {
		DATE: date(),
		TIME: time(),
		NPM_RUN: `pnpm --prefix ${projectFolder} run`,
	}
	const predeploy = () => cmd(format(predeploy_command, ENV))

	/** @type {Array<() => Promise<void>>} */
	const publishes = []

	/** @type {string[]} */
	const deployPaths = []

	/** @type {Array<() => Promise<void>>} */
	const configures = []

	if ("git" in config) {
		config.git.forEach((config) => {
			const commitName = format(config.commit_format, ENV)
			const { configure, path, publish } = git(config, tempFolder)
			configures.push(configure)
			publishes.push(() => publish(commitName))
			deployPaths.push(path)
		})
	}
	await Promise.all([...configures.map((c) => c()), predeploy(), sleep(1000)])
	await Promise.all(
		deployPaths.map((path) => copyFolderContent(directory, path))
	)
	await Promise.all(publishes)
}
