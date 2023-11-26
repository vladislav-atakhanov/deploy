/** @param {string[]} strings */
export const getLongestStringLength = (strings) =>
	strings.reduce((length, string) => Math.max(length, string.length), 0)
