// mock 階段的 JSON I/O 工具
// 接真實 DB 後這層會被換掉，controller 層就不用改
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MOCK_DATA_DIR = join(__dirname, '../mockData')

function resolvePath(fileName) {
  return join(MOCK_DATA_DIR, fileName)
}

// 讀取 mockData/*.json，失敗時回傳空陣列
export function readJson(fileName) {
  try {
    return JSON.parse(readFileSync(resolvePath(fileName), 'utf-8'))
  } catch {
    return []
  }
}

// 寫入 mockData/*.json，格式化為 2 空格縮排
export function writeJson(fileName, data) {
  writeFileSync(resolvePath(fileName), JSON.stringify(data, null, 2), 'utf-8')
}
