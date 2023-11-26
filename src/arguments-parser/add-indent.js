/**
 *
 * @param {string} text
 * @param {number | string} symbol
 */
export const addIndent = (text, symbol, separator = "\n") => {
	if (typeof symbol === "number") symbol = " ".repeat(symbol)

	return text
		.split(separator)
		.map((line) => symbol + line)
		.join(separator)
}
