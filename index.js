#!/usr/bin/env node
import { join } from "node:path"
import { main } from "./src/main.js"
import { ensureFolderExists } from "./src/utils/ensure-folder-exists.js"
import { getDirname } from "./src/utils/get-dirname.js"

const __dirname = getDirname(import.meta.url)
const TEMP_FOLDER = ensureFolderExists(join(__dirname, "temp"))
main(TEMP_FOLDER, process.argv)
