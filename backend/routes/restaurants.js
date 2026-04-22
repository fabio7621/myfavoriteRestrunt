import { Router } from 'express'
import { validateRestaurantInput } from '../models/index.js'
import { validate } from '../middleware/index.js'
import {
  listRestaurants,
  addRestaurant,
  removeRestaurant
} from '../controllers/index.js'

const router = Router()

router.get('/', listRestaurants)
router.post('/', validate(validateRestaurantInput), addRestaurant)
router.delete('/:id', removeRestaurant)

export default router
