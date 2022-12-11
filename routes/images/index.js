const db = require( '../../db' )

module.exports = {
    routes: [
        /*{
            //the sproc needs to be modidifed in sql, chnges were made
            url: '/images',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .input( 'variantId', db.sql.Int, req.body.bcid )
                        .input( 'variantId2', db.sql.Int, req.body.id )
                        .input( 'variantTitle', db.sql.NVarChar( 225 ), req.body.variantTitle )
                        .input( 'imgName', db.sql.NVarChar( 255 ), req.body.imgName )
                        .execute( 'InsertImage', (err, result) => {
                            res.status( 200 ).json( { message: 'success' } )
                        })
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },
        */
        {
            url: '/images/missing',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `execute [dbo].[getProductsMissingImages]` )
                        
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },
        {
            url: '/images/:uuid',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .input( 'uuid', db.sql.VarChar, req.params.uuid )
                        .query( `select imgName from [dbo].${process.env.DB_TABLE_IMAGES} where uuid = @uuid order by imgName` )
                
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        }
    ]
}
