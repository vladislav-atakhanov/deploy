import { addIndent } from "./add-indent.js"
import { showTable } from "./table.js"
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

const VALUES = new Map()
VALUES.set(String, "str")
VALUES.set(Number, "int")

/** @param {Pick<Argument, "args" | "type">} arg */
const argsHelp = ({ args, type }) =>
	args.map((arg) => {
		if (type === Boolean) return arg
		const name = VALUES.get(type) || type.name || "value"
		return `${arg} ${name.toUpperCase()}`
	})

/** @param {Argument} arg */
const getArgumentTable = ({ args, description, type }) => {
	return [argsHelp({ args, type }).join(", "), description]
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
		const isFull = keys.length <= 0
		const needArguments = isFull
			? this.arguments
			: this.arguments.filter(({ key }) => keys.includes(key))

		if (needArguments.length < 1) return "Unknown argument"
		let helpMessage = isFull ? `${this.title}\nArguments:\n` : ""
		let indent = isFull ? 4 : 0

		const argumentsMessage = showTable(needArguments.map(getArgumentTable))
		helpMessage += addIndent(argumentsMessage, indent)
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
