export { cmd } from "../utils/cmd.js"
import { git } from "./git.js"
import { ssh } from "./ssh.js"

/**
 * @typedef Action
 * @type {import("./action.ts").Action}
 */

/**
 * @param {Action[]} actions
 * @param {string} directory
 */
export const publish = (actions, directory) =>
	Promise.all(actions.map(({ publish }) => publish(directory)))

/** @param {Action[]} actions */
export const configure = (actions) =>
	Promise.all(actions.map(({ configure }) => configure()))

/**
 * @param {Action[]} actions
 * @param {string} directory
 */
export const prepublish = async (actions, directory) =>
	Promise.all(actions.map(({ prepublish }) => prepublish(directory)))

export const allActions = { git, ssh }
