export { cmd } from "./cmd.js"
export { git } from "./git.js"
/**
 * @typedef Action
 * @type {object}
 * @property {(directory: string) => Promise<void>} prepublish
 * @property {(directory: string) => Promise<void>} publish
 * @property {() => Promise<void>} configure
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
