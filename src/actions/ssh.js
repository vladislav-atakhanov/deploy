import { cmd } from "../utils/cmd.js"

/**
 *
 * @param {import("../config/config").SSH} config
 * @returns {import("./action.js").Action}
 */
export const ssh = ({ folder, server }) => {
	return {
		configure: () => cmd(`ssh ${server} "rm -rf ${folder}"`),
		publish: (directory) => cmd(`scp -r ${directory} ${server}:${folder}`),
		prepublish: async () => {},
	}
}
