const sql = require( 'mssql' )

console.log(process.env.DB_SRVR)

const config = { 
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB,
    server: process.env.DB_SRVR,
    requestTimeout : 130000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false,
      trustServerCertificate: false
    }
  }
  
const appPool = new sql.ConnectionPool( config )

appPool.connect().then( function( pool ) {
    console.log( 'Database connection successfull' )
    return pool;
} ).catch( function( err ) {
    console.error( 'Error creating connection pool', err )
} );

module.exports = {
    sql, appPool
} 
