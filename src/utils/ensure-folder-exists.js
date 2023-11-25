import fs from "node:fs"
/**
 *
 * @param {string} path
 * @returns {string}
 */
export const ensureFolderExists = (path) => {
	if (!fs.existsSync(path)) fs.mkdirSync(path)
	return path
}
