import express, { request } from 'express'
import bodyParser from 'body-parser'
import Database from './database/database'
import asyncMiddleware from './utils/asyncMiddleware'
import { requestsRoute } from './routes/requests'
import { contactsRoute } from './routes/contacts'
import { organizationsRoute } from './routes/organizations'
import { updatesRoute } from './routes/updates'

export const database = new Database()
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  //cors
  res.header(
    'Access-Control-Allow-Methods',
    'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT'
  )
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use('/requests', requestsRoute)
app.use('/contacts', contactsRoute)
app.use('/organizations', organizationsRoute)
app.use('/updates', updatesRoute)

app.get(
  '/sync',
  asyncMiddleware(async (req, res, next) => {
    await database.sync()
    res.json({
      status: 'success'
    })
  })
)

const port = process.env.PORT || 5000
app.listen(port)

console.log('App is listening on port ' + port)
