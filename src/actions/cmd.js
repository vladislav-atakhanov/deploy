import { exec } from "node:child_process"

/**
 * @param {string} command
 */
export const cmd = async (command) =>
	new Promise((resolve, reject) => {
		const child = exec(command.trim())
		child.on("close", resolve)
		child.on("error", reject)
	})
