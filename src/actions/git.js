import { cmd } from "./cmd.js"
import { join } from "node:path"
import fs from "node:fs"
import fsPromises from "node:fs/promises"

const repoName = (repo) =>
	repo
		.split("/")
		.at(-1)
		.replace(/\.git$/, "")

/**
 *
 * @param {string} repo
 * @param {string} folder
 * @returns
 */
const clone = async (repo, folder) => {
	console.log("clone")
	await cmd(`git clone ${repo} ${folder}`)
}

/**
 * @param {Pick<GIT, "repo" | "branch">} config
 */
export const configure = async ({ repo, branch }, folder) => {
	if (fs.existsSync(folder) === false) await clone(repo, folder)
	else if (fs.existsSync(join(folder, ".git")) === false) {
		await fsPromises.rm(folder, { recursive: true, force: true })
		await clone(repo, folder)
	}
	const cwd = process.cwd()
	process.chdir(folder)
	await cmd(`git branch ${branch}`)
	process.chdir(cwd)
}
/**
 * @param {string} commitName
 */
export const publish = async (commitName, folder) => {
	const cwd = process.cwd()
	process.chdir(folder)
	await cmd(`git add .`)
	await cmd(`git commit -m "${commitName}"`)
	process.chdir(cwd)
}
/**
 * @param {GIT} config
 * @param {string} parent
 */
export const git = (config, parent) => {
	const folder = join(parent, repoName(config.repo))

	return {
		configure: () => configure(config, folder),
		publish: (commitName) => publish(commitName, folder),
		path: folder,
	}
}

/**
 * @typedef GIT
 * @type {object}
 * @property {string} branch
 * @property {string} commit_format
 * @property {string} repo
 */
