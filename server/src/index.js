import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import Database from './database/database'
import asyncMiddleware from './utils/asyncMiddleware'
import { requestsRoute } from './routes/requests'
import { contactsRoute } from './routes/contacts'
import { organizationsRoute } from './routes/organizations'
import { updatesRoute } from './routes/updates'

const CLIENT_BUILD_PATH = path.join(__dirname, '../public')
export const database = new Database()
const app = express()

app.use(express.static(CLIENT_BUILD_PATH))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  //cors
  res.header('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/api/requests', requestsRoute)
app.use('/api/contacts', contactsRoute)
app.use('/api/organizations', organizationsRoute)
app.use('/api/updates', updatesRoute)

app.get(
  '/api/sync',
  asyncMiddleware(async (req, res, next) => {
    await database.sync()
    res.json({
      status: 'success'
    })
  })
)

app.get('*', function(request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'))
})

const port = process.env.PORT || 5000
app.listen(port)

console.log('App is listening on port ' + port)
