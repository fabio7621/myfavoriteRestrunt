const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// 呼叫 Nominatim 查詢單一地址字串
async function nominatimQuery(query) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=tw`,
    { headers: { 'User-Agent': 'LunchMap/1.0' } }
  )
  const results = await response.json()
  if (results.length === 0) return null
  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) }
}

// 將地址文字轉換為經緯度座標（Nominatim 公開 API）
// 台灣 OSM 門牌覆蓋率低，採三段式 fallback：
//   策略1：完整地址
//   策略2：路名 + 城市（最常命中）
//   策略3：行政區 + 城市（最後保底）
async function geocodeAddress(addressText) {
  // 移除開頭郵遞區號（如 803、100-00）
  const addr = addressText.replace(/^\d{3,6}/, '').trim()

  // 策略 1：完整地址
  const result1 = await nominatimQuery(addr)
  if (result1) return result1

  // 解析台灣地址結構：{城市}{行政區}{路街名}{段}{門牌}
  // 路名含「段」一起帶（如「忠孝東路四段」），避免查到同名路的其他縣市
  const parts = addr.match(/^(.*?[市縣])(.*?[區鄉鎮市])?(.*?[路街道巷][一二三四五六七八九十百]*段?)?(\d.*)?$/)
  const city = parts?.[1] || ''
  const district = parts?.[2] || ''
  const street = parts?.[3] || ''

  // 策略 2：路名 + 城市
  if (street && city) {
    const result2 = await nominatimQuery(`${street} ${city}`)
    if (result2) return result2
  }

  // 策略 3：行政區 + 城市
  if (district && city) {
    const result3 = await nominatimQuery(`${district} ${city}`)
    if (result3) return result3
  }

  return null
}

// 取得所有餐廳列表
async function fetchRestaurants() {
  const response = await fetch(`${BASE_URL}/restaurants`)
  if (!response.ok) throw new Error('取得餐廳失敗')
  return response.json()
}

// 新增餐廳
async function createRestaurant(data) {
  const response = await fetch(`${BASE_URL}/restaurants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('新增餐廳失敗')
  return response.json()
}

// 取得記錄，支援 month=YYYY-MM 或 tag=標籤 查詢
async function fetchRecords(params = {}) {
  const query = new URLSearchParams(params).toString()
  const response = await fetch(`${BASE_URL}/records${query ? '?' + query : ''}`)
  if (!response.ok) throw new Error('取得記錄失敗')
  return response.json()
}

// 新增午餐記錄
async function createRecord(data) {
  const response = await fetch(`${BASE_URL}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('新增記錄失敗')
  return response.json()
}

// 更新午餐記錄
async function updateRecord(id, data) {
  const response = await fetch(`${BASE_URL}/records/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('更新記錄失敗')
  return response.json()
}

// 刪除餐廳
async function deleteRestaurant(id) {
  const response = await fetch(`${BASE_URL}/restaurants/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('刪除餐廳失敗')
}

// 取得所有標籤與出現次數
async function fetchTags() {
  const response = await fetch(`${BASE_URL}/tags`)
  if (!response.ok) throw new Error('取得標籤失敗')
  return response.json()
}

export default {
  geocodeAddress,
  fetchRestaurants,
  createRestaurant,
  deleteRestaurant,
  fetchRecords,
  createRecord,
  updateRecord,
  fetchTags
}
