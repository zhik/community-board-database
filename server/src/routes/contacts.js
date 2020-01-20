import express from 'express'
import { database } from '../index'
import asyncMiddleware from '../utils/asyncMiddleware'

const router = express.Router()

router.get(
  '/',
  asyncMiddleware(async (req, res, next) => {
    res.json(await database.Contact.findAll())
  })
)

router.post(
  '/',
  asyncMiddleware(async (req, res, next) => {
    const request = await database.addRecordJSON(
      'Contacts',
      database.Contact,
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
      'Contacts',
      database.Contact,
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
      'Contacts',
      database.Contact,
      id
    )
    res.json(request)
  })
)

export { router as contactsRoute }
