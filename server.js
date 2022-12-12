const dotenv = require('dotenv').config();
const express = require( 'express' )
const bp = require('body-parser')
const morgan = require('morgan')
const app = express()
let { registerRoutes } = require('./util/registerRoutes');
const { application } = require('express');
let router = express.Router();

app.use(express.json());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
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


const server = app.listen( process.env.PORT, function () {
  const host = process.env.HOST
  const port = server.address().port;
  console.log( 'app listening at http://%s:%s', host, port )
} )
