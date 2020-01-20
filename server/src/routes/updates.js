import express from 'express'
import { database } from '../index'
import asyncMiddleware from '../utils/asyncMiddleware'

const router = express.Router()

router.get(
  '/',
  asyncMiddleware(async (req, res, next) => {
    res.json(await database.Update.findAll())
  })
)

router.post(
  '/',
  asyncMiddleware(async (req, res, next) => {
    const request = await database.addRecordJSON(
      'Updates',
      database.Update,
      req.body
    )
    res.json(request)
  })
)

router.put(
  '/:id',
  asyncMiddleware(async (req, res, next) => {
    const { id } = req.params
    const request = await database.editRecordJSON(
      'Updates',
      database.Update,
      req.body,
      id
    )
    res.json(request)
  })
)

router.delete(
  '/:id',
  asyncMiddleware(async (req, res, next) => {
    const { id } = req.params
    const request = await database.deleteRecordJSON(
      'Updates',
      database.Update,
      id
    )
    res.json(request)
  })
)

export { router as updatesRoute }
