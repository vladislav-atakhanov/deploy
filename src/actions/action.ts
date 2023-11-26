export interface Action {
	prepublish: (directory) => void
	publish: (directory) => void
	configure: () => void
}
