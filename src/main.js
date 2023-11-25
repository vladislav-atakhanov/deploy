import { join } from "node:path"
import { findFile } from "./utils/find-file.js"
import { date, time } from "./utils/datetime.js"
import { format } from "./utils/format.js"
import { copyFolderContent } from "./utils/copy-folder-content.js"
import { readFile } from "./utils/read-file.js"
import { cmd, git } from "./actions/index.js"
import { sleep } from "./utils/sleep.js"

/**
 * @typedef Config
 * @type {object}
 * @property {string} predeploy_command
 * @property {string} directory
 * @property {import("./actions/git.js").GIT} [git]
 */

/**
 *
 * @param {string} path
 * @returns {Promise<Config>}
 */
const getConfig = async (path) => {
	return JSON.parse(await readFile(path))
}

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
	let configure = () => new Promise((r) => r)
	let publish = () => new Promise((r) => r)
	let deployPath

	if (config.git) {
		const _git = git(config.git, tempFolder)
		const commitName = () => format(config.git.commit_format, ENV)
		configure = _git.configure
		publish = () => _git.publish(commitName())
		deployPath = _git.path
	}
	await Promise.all([configure(), predeploy(), sleep(1000)])
	await copyFolderContent(directory, deployPath)
	// await publish()
}
