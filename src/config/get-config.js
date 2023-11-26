import { readFile } from "../utils/read-file.js"

/**
 *
 * @param {string} path
 * @returns {Promise<JSONConfig>}
 */
const readConfig = async (path) => {
	return JSON.parse(await readFile(path))
}

/**
 * @param {JSONConfig["ssh"]} sshs
 * @returns {Config["ssh"]}
 */
const createSSHConfig = (sshs) => {
	if (!Array.isArray(sshs)) sshs = [sshs]
	return sshs.map((config) => {
		console.log(config.split(":"))
		const [server, folder] = config.split(":")
		return { folder, server }
	})
}

/** @param {JSONConfig["git"]} gits */
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
 * @typedef JSONConfig
 * @type {import("./config.ts").JSONConfig}
 */
/**
 * @typedef Config
 * @type {import("./config.ts").Config}
 */

/**
 * @template {keyof Config} T
 * @param {JSONConfig} config
 * @param {string} key
 * @param {(t: JSONConfig[T]) => Config[T]} action
 */
const createTargetConfig = (config, key, action) => {
	if (key in config) config[key] = action(config[key])
}

/**
 *
 * @param {string} path
 * @returns {Promise<Config>}
 */
export const getConfig = async (path) => {
	const config = await readConfig(path)
	createTargetConfig(config, "git", createGitConfig)
	createTargetConfig(config, "ssh", createSSHConfig)
	/** @type {any} */
	const a = config
	return a
}
