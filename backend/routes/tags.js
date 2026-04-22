import { Router } from 'express'
import { listTags } from '../controllers/index.js'

const router = Router()

router.get('/', listTags)

export default router
