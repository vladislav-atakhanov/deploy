#!/usr/bin/env node C:\work\deploy\index.js
import { main } from "./src/main.js"
import { ensureFolderExists } from "./src/utils/ensure-folder-exists.js"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMP_FOLDER = ensureFolderExists(path.join(__dirname, "temp"))
main(TEMP_FOLDER)
