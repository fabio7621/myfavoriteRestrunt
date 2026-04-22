import mongoose from 'mongoose'

const MAX_NOTE_LENGTH = 200
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// LunchRecord Schema
const lunchRecordSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'date 為必填'],
      match: [DATE_PATTERN, 'date 格式錯誤，需為 YYYY-MM-DD']
    },
    restaurant_id: {
      type: String,
      default: null
    },
    restaurant_name: {
      type: String,
      required: [true, 'restaurant_name 為必填'],
      trim: true,
      minlength: [1, 'restaurant_name 不可為空']
    },
    address: {
      type: String,
      required: [true, 'address 為必填'],
      trim: true,
      minlength: [1, 'address 不可為空']
    },
    tags: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'tags 至少需要一個且必須為陣列'
      }
    },
    photos: {
      type: [String],
      default: []
    },
    note: {
      type: String,
      default: '',
      maxlength: [MAX_NOTE_LENGTH, `note 長度不可超過 ${MAX_NOTE_LENGTH} 字`]
    }
  },
  {
    versionKey: false,
    timestamps: false
  }
)

export const LunchRecord = mongoose.model('LunchRecord', lunchRecordSchema)
export { lunchRecordSchema, MAX_NOTE_LENGTH }

// POST 驗證：整份 body 需完整
export function validateLunchRecordCreateInput(body) {
  if (!body || typeof body !== 'object') return ['request body 格式錯誤']

  const doc = new LunchRecord(body)
  const error = doc.validateSync()
  if (!error) return []

  return Object.values(error.errors).map(e => e.message)
}

// PUT 驗證：date 不需提供，僅驗非 date 欄位
export function validateLunchRecordUpdateInput(body) {
  if (!body || typeof body !== 'object') return ['request body 格式錯誤']

  const doc = new LunchRecord(body)
  const error = doc.validateSync(['restaurant_name', 'address', 'tags', 'photos', 'note'])
  if (!error) return []

  return Object.values(error.errors).map(e => e.message)
}

// 建立新的 LunchRecord 物件
export function createLunchRecord({
  date,
  restaurant_id,
  restaurant_name,
  address,
  tags,
  photos,
  note
}) {
  return {
    id: String(Date.now()),
    date,
    restaurant_id: restaurant_id || null,
    restaurant_name,
    address,
    tags,
    photos: photos || [],
    note: note || ''
  }
}

// 合併既有記錄與更新欄位（不變動原物件）
export function mergeLunchRecord(existing, patch) {
  return {
    ...existing,
    restaurant_id: patch.restaurant_id ?? existing.restaurant_id,
    restaurant_name: patch.restaurant_name,
    address: patch.address,
    tags: patch.tags,
    photos: patch.photos ?? existing.photos,
    note: patch.note ?? ''
  }
}
