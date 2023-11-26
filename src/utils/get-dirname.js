import path from "node:path"
import { getFilename } from "./get-filename.js"

/**
 *
 * @param {string} url
 * @returns {string}
 */
export const getDirname = (url) => path.dirname(getFilename(url))
