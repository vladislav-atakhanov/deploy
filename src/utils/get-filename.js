import { fileURLToPath } from "node:url"

/**
 *
 * @param {string} url
 * @returns {string}
 */
export const getFilename = (url) => fileURLToPath(url)
