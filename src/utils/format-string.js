/**
 *
 * @param {string} command
 * @param {Record<string, string>} vars
 * @returns
 */
export const formatString = (command, vars) => {
	for (const key in vars) {
		const value = vars[key]
		command = command.replaceAll(`{{${key}}}`, value)
	}
	return command
}
