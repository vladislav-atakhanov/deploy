export const date = (now = new Date()) => now.toISOString().split("T")[0]
export const time = (now = new Date()) =>
	now.toISOString().split("T")[1].split(".")[0]
