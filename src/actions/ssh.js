import { cmd } from "../utils/cmd.js"

/** @param {import("../config/config").SSH} ssh */
const clear = ({ server, folder }) => cmd(`ssh ${server} "rm -rf ${folder}"`)

/**
 * @param {string} directory
 * @param {import("../config/config").SSH} ssh
 */
const publish = (directory, { server, folder }) =>
	cmd(`scp -r ${directory} ${server}:${folder}`)

/**
 *
 * @param {import("../config/config").SSH[]} sshs
 * @param {{parent: string, format: (x: string) => string}} params
 * @returns {import("./action.js").Action}
 */
export const ssh = (sshs, { format }) => {
	sshs = sshs.map(({ server, folder }) => ({
		server: format(server),
		folder: format(folder),
	}))
	return {
		configure: () => Promise.all(sshs.map(clear)),
		publish: (d) => Promise.all(sshs.map((ssh) => publish(d, ssh))),
		prepublish: async () => {},
	}
}
