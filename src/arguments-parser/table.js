import { getLongestStringLength } from "./get-longest-string-length.js"
import { whiteSpace } from "./whitespace.js"
import { wordwrap } from "./wordwrap.js"

/** @param {unknown[][]} table */
const flipTable = (table) => {
	const newTable = []
	table[0].forEach((_, column) => {
		newTable.push(table.map((row) => row[column]))
	})
	return newTable
}

/** @param {string[][]} table */
export const showTable = (
	table,
	{ columnGap = "    ", rowGap = "\n", width = 80 } = {}
) => {
	const columnSizes = table[0].map((_, column) =>
		getLongestStringLength(table.map((row) => row[column]))
	)
	columnSizes[columnSizes.length - 1] =
		width - columnSizes[0] - columnGap.length * (columnSizes.length - 1)
	const newTable = table
		.map((row) =>
			row.map((value, column) =>
				wordwrap(
					whiteSpace(value, columnSizes[column]),
					columnSizes[column]
				)
			)
		)
		.map((row) => {
			const height = row.reduce((height, line) => {
				return Math.max(height, line.length)
			}, 0)
			return row.map((column, index) => {
				while (column.length < height)
					column.push(whiteSpace(columnSizes[index]))
				return column
			})
		})

	return newTable
		.map((row) =>
			flipTable(row)
				.map((line) => line.join(columnGap))
				.join("\n")
		)
		.join(rowGap)
}
