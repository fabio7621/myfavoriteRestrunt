import request from 'supertest'
import app from '../index.js'

describe('GET /api/tags', () => {
  test('回傳陣列', async () => {
    const res = await request(app).get('/api/tags')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('每筆有 id、name、count', async () => {
    const res = await request(app).get('/api/tags')
    for (const t of res.body) {
      expect(t).toHaveProperty('id')
      expect(t).toHaveProperty('name')
      expect(t).toHaveProperty('count')
    }
  })

  test('依 count 降冪排序', async () => {
    const res = await request(app).get('/api/tags')
    const counts = res.body.map(t => t.count)
    for (let i = 0; i < counts.length - 1; i++) {
      expect(counts[i]).toBeGreaterThanOrEqual(counts[i + 1])
    }
  })
})
