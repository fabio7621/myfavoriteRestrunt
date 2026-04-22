// LunchRecord 商業邏輯
import {
  createLunchRecord,
  mergeLunchRecord,
  recalculateTagCounts
} from '../models/index.js'
import { readJson, writeJson } from '../utils/jsonStore.js'

const RECORDS_FILE = 'lunchRecords.json'
const TAGS_FILE = 'tags.json'

// 每次記錄變動後，把 tag 計數寫回 tags.json
function syncTagCounts(records) {
  const existingTags = readJson(TAGS_FILE)
  const nextTags = recalculateTagCounts(records, existingTags)
  writeJson(TAGS_FILE, nextTags)
}

// GET /api/records?month=YYYY-MM 或 ?tag=日式
export function listRecords(req, res) {
  const { month, tag } = req.query
  let records = readJson(RECORDS_FILE)

  if (month) {
    records = records.filter(r => r.date.startsWith(month))
  }
  if (tag) {
    records = records.filter(r => r.tags.includes(tag))
  }

  res.json(records)
}

// POST /api/records
export function addRecord(req, res) {
  const records = readJson(RECORDS_FILE)
  const newRecord = createLunchRecord(req.body)
  const nextRecords = [...records, newRecord]

  writeJson(RECORDS_FILE, nextRecords)
  syncTagCounts(nextRecords)

  res.status(201).json(newRecord)
}

// PUT /api/records/:id
export function updateRecord(req, res) {
  const { id } = req.params
  const records = readJson(RECORDS_FILE)
  const index = records.findIndex(r => r.id === id)

  if (index === -1) {
    return res.status(404).json({ error: '找不到此記錄' })
  }

  const updated = mergeLunchRecord(records[index], req.body)
  const nextRecords = records.map((r, i) => (i === index ? updated : r))

  writeJson(RECORDS_FILE, nextRecords)
  syncTagCounts(nextRecords)

  res.json(updated)
}
