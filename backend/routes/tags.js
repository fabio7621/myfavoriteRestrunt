import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const tagsPath = join(__dirname, '../mockData/tags.json')

const router = Router()

// GET /api/tags — 取得所有標籤與出現次數，依 count 降冪排序
router.get('/', (req, res) => {
  const tags = JSON.parse(readFileSync(tagsPath, 'utf-8'))
  const sorted = [...tags].sort((a, b) => b.count - a.count)
  res.json(sorted)
})

export default router
