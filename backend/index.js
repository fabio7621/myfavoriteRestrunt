import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import restaurantsRouter from './routes/restaurants.js'
import recordsRouter from './routes/records.js'
import tagsRouter from './routes/tags.js'
import { requestLogger, notFoundHandler, errorHandler } from './middleware/index.js'

const PORT = 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/restaurants', restaurantsRouter)
app.use('/api/records', recordsRouter)
app.use('/api/tags', tagsRouter)

// 404 + 全域錯誤處理：必須放在所有 routes 之後
app.use(notFoundHandler)
app.use(errorHandler)

// 直接執行時才啟動伺服器，import 時不監聽（供測試使用）
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`後端伺服器運行於 http://localhost:${PORT}`)
  })
}

export default app
