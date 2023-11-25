import * as fs from "node:fs"
import * as path from "node:path"

/**
 *
 * @param {string} path
 * @returns {Promise<boolean>}
 */
const isDirectory = async (path) =>
	(await fs.promises.lstat(path)).isDirectory()
/**
 *
 * @param {string} source
 * @param {string} target
 */
export async function copyFile(source, target) {
	let targetFile = target

	// If target is a directory, a new file with the same name will be created
	if (fs.existsSync(target)) {
		if (await isDirectory(target)) {
			targetFile = path.join(target, path.basename(source))
		}
	}

	await fs.promises.writeFile(targetFile, await fs.promises.readFile(source))
}

/**
 *
 * @param {string} source
 * @param {string} target
 */
export async function copyFolderRecursive(source, target) {
	// Check if folder needs to be created or integrated
	const targetFolder = path.join(target, path.basename(source))
	if (!fs.existsSync(targetFolder)) await fs.promises.mkdir(targetFolder)

	// Copy
	if ((await isDirectory(source)) === false) {
		return
	}
	const files = await fs.promises.readdir(source)
	await Promise.all(
		files.map(async (file) => {
			const currentSource = path.join(source, file)
			if (await isDirectory(currentSource)) {
				await copyFolderRecursive(currentSource, targetFolder)
			} else {
				await copyFile(currentSource, targetFolder)
			}
		})
	)
}

/**
 *
 * @param {string} source
 * @param {string} target
 */
export async function copyFolderContent(source, target) {
	if ((await isDirectory(source)) === false) {
		return
	}
	const files = await fs.promises.readdir(source)
	await Promise.all(
		files.map(async (file) => {
			const currentSource = path.join(source, file)
			const currentTarget = path.join(target, file)

			if (await isDirectory(currentSource)) {
				await copyFolderRecursive(currentSource, target)
			} else {
				await copyFile(currentSource, currentTarget)
			}
		})
	)
}
