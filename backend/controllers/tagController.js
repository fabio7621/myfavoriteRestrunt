// Tag 商業邏輯
import { readJson } from '../utils/jsonStore.js'

const FILE = 'tags.json'

// GET /api/tags — 依 count 降冪
export function listTags(req, res) {
  const tags = readJson(FILE)
  const sorted = [...tags].sort((a, b) => b.count - a.count)
  res.json(sorted)
}
