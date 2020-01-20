import express from 'express'
import { database } from '../index'
import asyncMiddleware from '../utils/asyncMiddleware'

const router = express.Router()

router.get(
  '/',
  asyncMiddleware(async (req, res, next) => {
    res.json(await database.Organization.findAll())
  })
)

router.post(
  '/',
  asyncMiddleware(async (req, res, next) => {
    const request = await database.addRecordJSON(
      'Organizations',
      database.Organization,
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
      'Organizations',
      database.Organization,
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
      'Organizations',
      database.Organization,
      id
    )
    res.json(request)
  })
)

export { router as organizationsRoute }
