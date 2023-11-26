import { cmd } from "./cmd.js"
import { join } from "node:path"
import fs from "node:fs"
import fsPromises from "node:fs/promises"
import { copyFolderContent } from "../utils/copy-folder-content.js"
import { clearFolder } from "../utils/clear-folder.js"

/** @param {string} repo */
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
 * @param {string} folder
 */
export const publish = async (commitName, folder) => {
	const cwd = process.cwd()
	process.chdir(folder)
	await cmd("git add .")
	await cmd(`git commit -m "${commitName}"`)
	await cmd("git push")
	process.chdir(cwd)
}

/**
 * @param {GIT} config
 * @param {{parent: string, format: (x: string) => string}} params
 */
export const git = (config, { parent, format }) => {
	const folder = join(parent, repoName(config.repo))

	return {
		configure: () => configure(config, folder),
		publish: (directory) => publish(format(config.commit_format), folder),
		prepublish: async (directory) => {
			await clearFolder(folder, { blacklist: [".git"] })
			await copyFolderContent(directory, folder)
		},
	}
}

/**
 * @typedef GIT
 * @type {object}
 * @property {string} branch
 * @property {string} commit_format
 * @property {string} repo
 */
