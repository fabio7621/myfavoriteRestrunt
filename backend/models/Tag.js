import mongoose from 'mongoose'

// Tag Schema — name 唯一，count 由記錄統計計算
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name 為必填'],
      trim: true,
      unique: true
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    versionKey: false,
    timestamps: false
  }
)

export const Tag = mongoose.model('Tag', tagSchema)
export { tagSchema }

// 依所有記錄重算 tag 計數，合併既有標籤並新增未出現的
// 回傳新陣列，不修改輸入
export function recalculateTagCounts(records, existingTags) {
  const countMap = {}
  for (const record of records) {
    for (const tagName of record.tags) {
      countMap[tagName] = (countMap[tagName] || 0) + 1
    }
  }

  const existingNames = new Set(existingTags.map(t => t.name))

  const updatedExisting = existingTags.map(tag => ({
    ...tag,
    count: countMap[tag.name] || 0
  }))

  const maxId = existingTags.reduce((max, t) => Math.max(max, Number(t.id)), 0)
  let nextId = maxId + 1

  const newTags = []
  for (const [name, count] of Object.entries(countMap)) {
    if (!existingNames.has(name)) {
      newTags.push({ id: String(nextId++), name, count })
    }
  }

  return [...updatedExisting, ...newTags]
}
