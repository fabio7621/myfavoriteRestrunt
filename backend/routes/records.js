import { Router } from 'express'
import {
  validateLunchRecordCreateInput,
  validateLunchRecordUpdateInput
} from '../models/index.js'
import { validate } from '../middleware/index.js'
import {
  listRecords,
  addRecord,
  updateRecord
} from '../controllers/index.js'

const router = Router()

router.get('/', listRecords)
router.post('/', validate(validateLunchRecordCreateInput), addRecord)
router.put('/:id', validate(validateLunchRecordUpdateInput), updateRecord)

export default router
