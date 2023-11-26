/**
 *
 * @param {string} text
 * @param {string} [separator]
 * @param {string} text
 * @param {number} [width]
 * @returns {string[]}
 */
export const wordwrap = (text, width = 75, separator = "\n") => {
	const regex = `.{1,${width}}(\\s|$)|\\S+?(\\s|$)`
	return text.match(RegExp(regex, "g")) ?? [""]
}
