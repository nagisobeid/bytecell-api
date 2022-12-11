const db = require( '../../db' )

module.exports = {
    routes: [
        {
            //the sproc needs to be modidifed in sql, chnges were made
            url: '/variants',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `select * from [dbo].${process.env.DB_TABLE_PRODS}` )
                
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },
        {
            //the sproc needs to be modidifed in sql, chnges were made
            url: '/variants/ids',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `select uuid from [dbo].${process.env.DB_TABLE_PRODS} group by uuid` )
                
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        }
    ]
}
