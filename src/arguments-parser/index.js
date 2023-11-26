import { addIndent } from "./add-indent.js"
import { getLongestStringLength } from "./get-longest-string-length.js"
import { whiteSpace } from "./whitespace.js"
import { wordwrap } from "./wordwrap.js"
/**
 *
 * @param {string[]} argv
 * @param {string[]} args
 */
const parseBoolean = (argv, args) => {
	for (const arg of args) {
		const index = argv.indexOf(arg)
		if (index >= 0) return index
	}
	return -1
}

/**
 *
 * @param {string[]} colums
 * @param {number[]} sizes
 */
const merge = (colums, sizes) => {
	const lines = colums.map((column, index) =>
		wordwrap(column, sizes[index]).map((line) =>
			whiteSpace(line.trim(), sizes[index])
		)
	)
	const largestLineLength = lines.reduce(
		(largest, line) => Math.max(line.length, largest),
		0
	)
	lines.forEach((line) => {
		while (line.length < largestLineLength) {
			line.push(whiteSpace(line[0].length))
		}
	})

	const result = []
	for (let index = 0; index < largestLineLength; index++)
		result.push(lines.reduce((result, line) => result + line[index], ""))

	return result.join("\n")
}

const VALUES = new Map()
VALUES.set(String, "string")
VALUES.set(Number, "int")

/** @param {Pick<Argument, "args" | "type">} arg */
const argsHelp = ({ args, type }) =>
	args.map((arg) => {
		if (type === Boolean) return arg
		const name = VALUES.get(type) || type.name || "value"
		return `${arg} ${name.toUpperCase()}`
	})

/**
 * @param {Argument} arg
 * @param {number} firstColumnSize
 */
const getArgumentMessage = (
	{ args, description, type },
	firstColumnSize,
	{ descriptionLength, gap }
) => {
	const argsHelps = argsHelp({ args, type })
	return merge(
		[argsHelps.join(", "), "", description || ""],
		[firstColumnSize, gap, descriptionLength]
	)
}

/** @param {Argument[]} argNames */
const getArgumentsMessage = (
	argNames,
	{ descriptionLength = 40, gap = 4 } = {}
) => {
	const firstColumnSize =
		getLongestStringLength(argNames.flatMap(argsHelp)) + 5
	return argNames.map((arg) =>
		getArgumentMessage(arg, firstColumnSize, { descriptionLength, gap })
	)
}
/**
 *
 * @param {string[]} argv
 * @param {string[]} args
 */
const parseString = (argv, args) => {
	const index = parseBoolean(argv, args)
	if (index < 0) return null
	return argv[index + 1]
}

export class ArgumentParser {
	/**
	 *
	 * @param {string} title
	 */
	constructor(title) {
		this.title = title
		/** @type {Argument[]} */
		this.arguments = []
	}
	/**
	 *
	 * @param {string} key
	 * @param {(x: any) => any} type
	 * @param {string | string[]} args
	 * @param {string} [description]
	 */
	add(key, type, args, description) {
		if (typeof args === "string") args = [args]
		this.arguments.push({ key, type, args, description })
		return this
	}

	getHelpMessage(args) {
		const keys = Array.from(Object.keys(args)).filter((key) => args[key])
		const isFull = keys.length > 0
		const needArguments = isFull
			? this.arguments.filter(({ key }) => keys.includes(key))
			: this.arguments

		if (needArguments.length < 1) return "Unknown argument"
		let helpMessage = args ? "" : `${this.title}\nArguments:\n`

		const indent = isFull ? 0 : 4
		helpMessage += addIndent(
			getArgumentsMessage(needArguments).join("\n"),
			indent
		)
		return helpMessage
	}

	help(args) {
		console.log(this.getHelpMessage(args))
	}

	/**
	 *
	 * @param {string[]} argv
	 * @returns {any}
	 */
	parse(argv) {
		return this.arguments.reduce((result, { type, key, args }) => {
			if (type === Boolean) {
				result[key] = parseBoolean(argv, args) >= 0
				return result
			}
			const r = parseString(argv, args)
			if (r) result[key] = type(r)
			return result
		}, {})
	}
}

/**
 * @typedef Argument
 * @type {object}
 * @property {string} key
 * @property {(x: any) => any} type
 * @property {string[]} args
 * @property {string} [description]
 */
