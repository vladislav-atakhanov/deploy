export interface GIT {
	branch: string
	commit_format: string
	repo: string
}
export interface SSH {
	server: string
	folder: string
}

export interface Config {
	predeploy_command: string
	directory: string
	git?: GIT[]
	ssh?: SSH[]
}
export interface JSONConfig {
	predeploy_command: string
	directory: string
	git?: GIT | GIT[]
	ssh?: string | string[]
}
