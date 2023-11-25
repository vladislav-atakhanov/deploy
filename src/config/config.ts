interface Git {
	branch: string
	commit_format: string
	repo: string
}

export interface Config {
	predeploy_command: string
	directory: string
	git?: Git[]
}
export interface JSONConfig {
	predeploy_command: string
	directory: string
	git?: Git | Git[]
}
