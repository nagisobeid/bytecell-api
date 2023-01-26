const dotenv = require('dotenv').config();
const express = require( 'express' )
const bp = require('body-parser')
const morgan = require('morgan')
const app = express()
const cors = require( 'cors' )

app.use( cors() )

let { registerRoutes } = require('./util/registerRoutes');
const { application } = require('express');
let router = express.Router();

app.use(express.json({limit: '50mb'}));
app.set('trust proxy', true)
app.use(bp.json())
app.use(bp.urlencoded({limit: '50mb', extended: true }))
app.use(morgan('combined'))

registerRoutes( router )

const checkAuthorize = function( req, res, next ) {
  if ( req.header('BYTECELLAPIKEY') != process.env.API_APIKEY ) {
    res.status(401).json( { message: 'error', data: 'Not Authorized' } )
  }
  else {
    next()
  }
}

app.use( checkAuthorize )

app.use(router)
app.disable('etag');


const server = app.listen( process.env.API_PORT, function () {
  const host = server.address().address//process.env.HOST
  const port = process.env.API_PORT// server.address().port;
  console.log( 'app listening at http://%s:%s', host, port )
} )
