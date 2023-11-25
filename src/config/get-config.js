import { readFile } from "../utils/read-file.js"

/**
 *
 * @param {string} path
 * @returns {Promise<import("./config.ts").JSONConfig>}
 */
const readConfig = async (path) => {
	return JSON.parse(await readFile(path))
}

/**
 * @typedef Gits
 * @type {import("./config.ts").JSONConfig["git"]}
 */

/**
 *
 * @param {Gits} gits
 * @returns
 */
const createGitConfig = (gits) => {
	if (!Array.isArray(gits)) return [gits]

	const map = new Map()
	for (const git of gits) map.set(git.repo, git)
	gits = Array.from(map.values())

	for (const git of gits) {
		if (!git.commit_format) git.commit_format = gits[0].commit_format
		if (!git.branch) git.branch = gits[0].branch
	}

	return gits
}

/**
 *
 * @param {string} path
 * @returns {Promise<import("./config.ts").Config>}
 */
export const getConfig = async (path) => {
	const config = await readConfig(path)
	if ("git" in config) {
		config.git = createGitConfig(config.git)
	}
	/** @type {any} */
	const a = config
	return a
}
