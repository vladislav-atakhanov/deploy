/**
 *
 * @param {string} directory
 * @param {() => Promise} action
 */
export const runInDirectory = async (directory, action) => {
	const cwd = process.cwd()
	process.chdir(directory)
	console.log(`cd ${directory}`)
	await action()
	console.log(`cd ${cwd}\n`)
	process.chdir(cwd)
}
