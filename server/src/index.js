import express from 'express'
import bodyParser from 'body-parser'
import init from './database/index'

const app = express()
init()

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

const port = process.env.PORT || 5000
app.listen(port)

console.log('App is listening on port ' + port)
