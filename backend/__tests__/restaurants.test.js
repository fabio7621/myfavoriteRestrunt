import request from 'supertest'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import app from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataPath = join(__dirname, '../mockData/restaurants.json')

// 測試前備份原始資料，測試後還原
let originalData

beforeAll(() => {
  originalData = readFileSync(dataPath, 'utf-8')
})

afterAll(() => {
  writeFileSync(dataPath, originalData, 'utf-8')
})

describe('GET /api/restaurants', () => {
  test('回傳陣列', async () => {
    const res = await request(app).get('/api/restaurants')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('每筆資料有必要欄位', async () => {
    const res = await request(app).get('/api/restaurants')
    for (const r of res.body) {
      expect(r).toHaveProperty('id')
      expect(r).toHaveProperty('name')
      expect(r).toHaveProperty('address')
      expect(r).toHaveProperty('location')
    }
  })
})

describe('POST /api/restaurants', () => {
  test('正常新增餐廳', async () => {
    const payload = { name: '測試餐廳', address: '高雄市測試區1號', location: { lat: 22.6, lng: 120.3 } }
    const res = await request(app).post('/api/restaurants').send(payload)
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('測試餐廳')
    expect(res.body.id).toBeDefined()
  })

  test('缺少名稱回傳 400', async () => {
    const res = await request(app).post('/api/restaurants').send({ address: '某路1號' })
    expect(res.status).toBe(400)
  })

  test('缺少地址回傳 400', async () => {
    const res = await request(app).post('/api/restaurants').send({ name: '測試' })
    expect(res.status).toBe(400)
  })
})
