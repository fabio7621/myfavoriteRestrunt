import mongoose from 'mongoose'

// Restaurant Schema — 日後接 MongoDB 時直接沿用
// 目前階段用於驗證 request body 與定義資料結構
const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name 為必填'],
      trim: true,
      minlength: [1, 'name 不可為空']
    },
    address: {
      type: String,
      required: [true, 'address 為必填'],
      trim: true,
      minlength: [1, 'address 不可為空']
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    }
  },
  {
    versionKey: false,
    timestamps: false
  }
)

export const Restaurant = mongoose.model('Restaurant', restaurantSchema)
export { restaurantSchema }

// 驗證 request body，回傳錯誤訊息陣列
export function validateRestaurantInput(body) {
  if (!body || typeof body !== 'object') return ['request body 格式錯誤']

  const doc = new Restaurant(body)
  const error = doc.validateSync()
  if (!error) return []

  return Object.values(error.errors).map(e => e.message)
}

// 建立新的 Restaurant 物件（mock 階段用 timestamp 當 id）
export function createRestaurant({ name, address, location }) {
  return {
    id: String(Date.now()),
    name,
    address,
    location: location || { lat: null, lng: null }
  }
}
