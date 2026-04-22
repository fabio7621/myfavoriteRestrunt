// Restaurant 商業邏輯
// 只跟 models + utils 溝通，不碰 Express 以外的細節
import { createRestaurant } from '../models/index.js'
import { readJson, writeJson } from '../utils/jsonStore.js'

const FILE = 'restaurants.json'

// GET /api/restaurants
export function listRestaurants(req, res) {
  const restaurants = readJson(FILE)
  res.json(restaurants)
}

// POST /api/restaurants
export function addRestaurant(req, res) {
  const restaurants = readJson(FILE)
  const newRestaurant = createRestaurant(req.body)

  writeJson(FILE, [...restaurants, newRestaurant])

  res.status(201).json(newRestaurant)
}

// DELETE /api/restaurants/:id
export function removeRestaurant(req, res) {
  const { id } = req.params
  const restaurants = readJson(FILE)
  const exists = restaurants.some(r => r.id === id)

  if (!exists) {
    return res.status(404).json({ error: '找不到此餐廳' })
  }

  const remaining = restaurants.filter(r => r.id !== id)
  writeJson(FILE, remaining)

  res.status(204).end()
}
