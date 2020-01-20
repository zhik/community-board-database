import express from 'express'
import { database } from '../index'
import asyncMiddleware from '../utils/asyncMiddleware'

const router = express.Router()

router.get(
  '/',
  asyncMiddleware(async (req, res, next) => {
    //res.setHeader('Cache-Control', 'public, max-age=60');
    res.json(await database.Request.findAll())
  })
)

router.get(
  '/:request_id',
  asyncMiddleware(async (req, res, next) => {
    const { request_id } = req.params
    const request = await database.Request.findByPk(request_id).then(
      async request => {
        //look up relationships
        const o = request.toJSON()
        if (o.updates) {
          o.updates = await database.Update.findAll({
            where: {
              id: o.updates
            }
          })
        }

        if (o.organizations) {
          o.organizations = await database.Organization.findAll({
            where: {
              id: o.organizations
            }
          })
        }

        if (o.contacts) {
          o.contacts = await database.Contact.findAll({
            where: {
              id: o.organizations
            }
          })
        }

        return o
      }
    )
    res.json(request)
  })
)

router.post(
  '/',
  asyncMiddleware(async (req, res, next) => {
    const request = await database.addRequest(database.Request, req.body)
    res.json(request)
  })
)

router.put(
  '/:request_id',
  asyncMiddleware(async (req, res, next) => {
    const { request_id } = req.params
    const request = await database.editRequest(
      database.Request,
      req.body,
      request_id
    )
    res.json(request)
  })
)

router.delete(
  '/:request_id',
  asyncMiddleware(async (req, res, next) => {
    const { request_id } = req.params
    const request = await database.deleteRequest(database.Request, request_id)
    res.json(request)
  })
)

export { router as requestsRoute }
