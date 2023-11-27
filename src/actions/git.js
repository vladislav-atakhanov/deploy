import { cmd } from "../utils/cmd.js"
import { join } from "node:path"
import fs from "node:fs"
import fsPromises from "node:fs/promises"
import { copyFolderContent } from "../utils/copy-folder-content.js"
import { clearFolder } from "../utils/clear-folder.js"
import { runInDirectory } from "../utils/run-in-directory.js"

/** @param {GIT["repo"]} repo */
const repoName = (repo) =>
	repo
		.split("/")
		.at(-1)
		.replace(/\.git$/, "")

/** @param {Pick<GIT, "repo" | "folder">} git */
const clone = ({ repo, folder }) => cmd(`git clone ${repo} ${folder}`)

/** @param {Pick<GIT, "repo" | "folder">} config */
export const configure = async ({ repo, folder }) => {
	if (fs.existsSync(folder) === false) await clone({ repo, folder })
	else if (fs.existsSync(join(folder, ".git")) === false) {
		await fsPromises.rm(folder, { recursive: true, force: true })
		await clone({ repo, folder })
	}
}

/**
 * @param {string} commitName
 * @param {string} folder
 */
export const publish = (commitName, folder) =>
	runInDirectory(folder, async () => {
		await cmd("git add .")
		await cmd(`git commit -m "${commitName}"`)
		await cmd("git push")
	})

/**
 * @param {GIT[]} gits
 * @param {{parent: string, format: (x: string) => string}} params
 * @returns {import("./action.js").Action}
 */
export const git = (gits, { parent, format }) => {
	gits = gits.map(({ repo, branch, commit_format }) => ({
		folder: join(parent, repoName(format(repo))),
		branch: format(branch),
		repo: format(repo),
		commit_format,
	}))
	return {
		configure: () => Promise.all(gits.map(configure)),
		async publish() {
			for (const { repo, commit_format } of gits) {
				const folder = join(parent, repoName(repo))
				await publish(format(commit_format), folder)
			}
		},
		async prepublish(directory) {
			await Promise.all(
				gits.map(async ({ folder }) => {
					await clearFolder(folder, { blacklist: [".git"] })
					await copyFolderContent(directory, folder)
				})
			)
			for (const { folder, branch } of gits)
				await runInDirectory(folder, () => cmd(`git branch ${branch}`))
		},
	}
}

/**
 * @typedef GIT
 * @type {import("../config/config.js").GIT}
 */
