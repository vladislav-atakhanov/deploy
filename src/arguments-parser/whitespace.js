/**
 *
 * @param {string | number} text
 * @param {number} [length]
 * @returns
 */
export const whiteSpace = (text, length) => {
	if (typeof text === "number") {
		length = text
		text = ""
	}
	return text + " ".repeat(Math.max(length - text.length, 0))
}
