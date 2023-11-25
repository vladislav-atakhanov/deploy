/**
 * Sleep
 * @param {number} ms
 * @returns
 */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
