import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import restaurantsRouter from './routes/restaurants.js'
import recordsRouter from './routes/records.js'
import tagsRouter from './routes/tags.js'

const PORT = 3000
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/restaurants', restaurantsRouter)
app.use('/api/records', recordsRouter)
app.use('/api/tags', tagsRouter)

// 直接執行時才啟動伺服器，import 時不監聽（供測試使用）
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`後端伺服器運行於 http://localhost:${PORT}`)
  })
}

export default app
