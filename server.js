const dotenv = require('dotenv').config();
const express = require( 'express' )
const bp = require('body-parser')
const morgan = require('morgan')
const app = express()
let { registerRoutes } = require('./util/registerRoutes')
let router = express.Router();

app.use(express.json());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(morgan('combined'))

registerRoutes( router )

app.use(router)
app.disable('etag');


const server = app.listen( process.env.PORT, function () {
  const host = process.env.HOST
  const port = server.address().port;
  console.log( 'app listening at http://%s:%s', host, port )
} )
