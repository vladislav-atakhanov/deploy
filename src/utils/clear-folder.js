import fsPromises from "node:fs/promises"
import { join } from "node:path"

/**
 *
 * @param {string} folder
 * @param {{blacklist: string[]}} config
 */
export const clearFolder = async (folder, { blacklist = [] }) => {
	const names = await fsPromises.readdir(folder, { recursive: false })
	await Promise.all(
		names.map((name) => {
			if (blacklist.includes(name)) return
			const path = join(folder, name)
			return fsPromises.rm(path, { recursive: true, force: true })
		})
	)
}
