import { Router } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const recordsPath = join(__dirname, '../mockData/lunchRecords.json')
const tagsPath = join(__dirname, '../mockData/tags.json')

const router = Router()

function readRecords() {
  try {
    return JSON.parse(readFileSync(recordsPath, 'utf-8'))
  } catch {
    return []
  }
}

function writeRecords(data) {
  writeFileSync(recordsPath, JSON.stringify(data, null, 2), 'utf-8')
}

function readTags() {
  try {
    return JSON.parse(readFileSync(tagsPath, 'utf-8'))
  } catch {
    return []
  }
}

function writeTags(data) {
  writeFileSync(tagsPath, JSON.stringify(data, null, 2), 'utf-8')
}

// 同步更新 tags.json 的計數
function syncTagCounts(records) {
  const countMap = {}
  for (const record of records) {
    for (const tag of record.tags) {
      countMap[tag] = (countMap[tag] || 0) + 1
    }
  }

  const tags = readTags()
  const existingNames = new Set(tags.map(t => t.name))

  // 更新現有標籤計數
  for (const tag of tags) {
    tag.count = countMap[tag.name] || 0
  }

  // 新增未出現過的標籤
  const maxId = tags.reduce((max, t) => Math.max(max, Number(t.id)), 0)
  let nextId = maxId + 1
  for (const [name, count] of Object.entries(countMap)) {
    if (!existingNames.has(name)) {
      tags.push({ id: String(nextId++), name, count })
    }
  }

  writeTags(tags)
}

// GET /api/records?month=YYYY-MM 或 ?tag=日式
router.get('/', (req, res) => {
  const { month, tag } = req.query
  let records = readRecords()

  if (month) {
    records = records.filter(r => r.date.startsWith(month))
  }

  if (tag) {
    records = records.filter(r => r.tags.includes(tag))
  }

  res.json(records)
})

// POST /api/records — 新增記錄
router.post('/', (req, res) => {
  const { date, restaurant_id, restaurant_name, address, tags, photos, note } = req.body

  if (!date || !restaurant_name || !address || !tags || tags.length === 0) {
    return res.status(400).json({ error: '日期、餐廳名稱、地址、標籤為必填' })
  }
  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: 'tags 格式錯誤，必須為陣列' })
  }

  const records = readRecords()
  const newRecord = {
    id: String(Date.now()),
    date,
    restaurant_id: restaurant_id || null,
    restaurant_name,
    address,
    tags,
    photos: photos || [],
    note: note || ''
  }

  records.push(newRecord)
  writeRecords(records)
  syncTagCounts(records)

  res.status(201).json(newRecord)
})

// PUT /api/records/:id — 更新記錄
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { restaurant_id, restaurant_name, address, tags, photos, note } = req.body

  if (!restaurant_name || !address || !tags || tags.length === 0) {
    return res.status(400).json({ error: '餐廳名稱、地址、標籤為必填' })
  }
  if (!Array.isArray(tags)) {
    return res.status(400).json({ error: 'tags 格式錯誤，必須為陣列' })
  }

  const records = readRecords()
  const index = records.findIndex(r => r.id === id)

  if (index === -1) {
    return res.status(404).json({ error: '找不到此記錄' })
  }

  records[index] = {
    ...records[index],
    restaurant_id: restaurant_id ?? records[index].restaurant_id,
    restaurant_name,
    address,
    tags,
    photos: photos ?? records[index].photos,
    note: note ?? ''
  }

  writeRecords(records)
  syncTagCounts(records)

  res.json(records[index])
})

export default router
