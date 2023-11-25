import { fileURLToPath } from "node:url"
import path from "node:path"

export const getDirname = (url) => {
	const __filename = fileURLToPath(url)
	return path.dirname(__filename)
}
