import { Router } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '../mockData/restaurants.json')

const router = Router()

// 讀取 JSON 假資料
function readData() {
  try {
    return JSON.parse(readFileSync(dataPath, 'utf-8'))
  } catch {
    return []
  }
}

// 寫入 JSON 假資料
function writeData(data) {
  writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8')
}

// GET /api/restaurants — 取得所有餐廳
router.get('/', (req, res) => {
  const restaurants = readData()
  res.json(restaurants)
})

// POST /api/restaurants — 新增餐廳
router.post('/', (req, res) => {
  const { name, address, location } = req.body

  if (!name || !address) {
    return res.status(400).json({ error: '名稱與地址為必填' })
  }

  const restaurants = readData()
  const newRestaurant = {
    id: String(Date.now()),
    name,
    address,
    location: location || { lat: null, lng: null }
  }

  restaurants.push(newRestaurant)
  writeData(restaurants)

  res.status(201).json(newRestaurant)
})

// DELETE /api/restaurants/:id — 刪除餐廳
router.delete('/:id', (req, res) => {
  const { id } = req.params
  const restaurants = readData()
  const index = restaurants.findIndex(r => r.id === id)

  if (index === -1) {
    return res.status(404).json({ error: '找不到此餐廳' })
  }

  restaurants.splice(index, 1)
  writeData(restaurants)

  res.status(204).end()
})

export default router
