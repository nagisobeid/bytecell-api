
const { MAX } = require('mssql');
const db = require( '../../db' )
const executeSproc = require('../../util/executeSproc')
//const bulkInsert = require( '../../util/bulkInsert' )
const bulkActions = require( '../../util/bulk' )

module.exports = {
    routes: [
        {
            url: '/collections/status',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `SELECT * FROM vwGetCollectionSyncStatus ORDER BY LASTUPDATE` )
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: err } )
                    }
                } 
            } 
        }
    ]
}
