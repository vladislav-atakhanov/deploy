import fsPromises from "node:fs/promises"
import fs from "node:fs"
/**
 *
 * @param {string} path
 * @returns {Promise<string>}
 */
export const readFile = async (path) => {
	if (!fs.existsSync(path)) throw new Error("File not found")
	return await fsPromises.readFile(path, "utf-8")
}
