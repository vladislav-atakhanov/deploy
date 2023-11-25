import { existsSync } from "node:fs"
import { join } from "node:path"

/**
 *
 * @param {string} filename
 * @param {string} path
 * @returns {string}
 * @throws {PackageJSONNotFound}
 */
export const findFile = (filename, path) => {
	let _path = `${path}`
	while (existsSync(join(_path, filename)) === false) {
		const old = _path
		_path = join(old, "..")
		if (old === _path) {
			throw new Error(`${filename} not found`)
		}
	}
	return join(_path, filename)
}
