import request from 'supertest'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import app from '../index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const recordsPath = join(__dirname, '../mockData/lunchRecords.json')
const tagsPath = join(__dirname, '../mockData/tags.json')

let originalRecords, originalTags

beforeAll(() => {
  originalRecords = readFileSync(recordsPath, 'utf-8')
  originalTags = readFileSync(tagsPath, 'utf-8')
})

afterAll(() => {
  writeFileSync(recordsPath, originalRecords, 'utf-8')
  writeFileSync(tagsPath, originalTags, 'utf-8')
})

describe('GET /api/records', () => {
  test('無參數回傳所有記錄', async () => {
    const res = await request(app).get('/api/records')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  test('month 參數過濾正確', async () => {
    const res = await request(app).get('/api/records?month=2026-03')
    expect(res.status).toBe(200)
    for (const r of res.body) {
      expect(r.date).toMatch(/^2026-03/)
    }
  })

  test('tag 參數過濾正確', async () => {
    const res = await request(app).get(`/api/records?tag=${encodeURIComponent('日式')}`)
    expect(res.status).toBe(200)
    for (const r of res.body) {
      expect(r.tags).toContain('日式')
    }
  })
})

describe('POST /api/records', () => {
  test('正常新增記錄', async () => {
    const payload = {
      date: '2026-03-26',
      restaurant_name: '測試食堂',
      address: '高雄市1號',
      tags: ['測試標籤'],
      note: '好吃'
    }
    const res = await request(app).post('/api/records').send(payload)
    expect(res.status).toBe(201)
    expect(res.body.restaurant_name).toBe('測試食堂')
    expect(res.body.tags).toContain('測試標籤')
  })

  test('缺少標籤回傳 400', async () => {
    const res = await request(app).post('/api/records').send({
      date: '2026-03-26',
      restaurant_name: '測試',
      address: '某路1號',
      tags: []
    })
    expect(res.status).toBe(400)
  })

  test('缺少日期回傳 400', async () => {
    const res = await request(app).post('/api/records').send({
      restaurant_name: '測試',
      address: '某路1號',
      tags: ['日式']
    })
    expect(res.status).toBe(400)
  })
})
