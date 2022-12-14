const db = require( '../../db' )

module.exports = {
    routes: [
        {
            //the sproc needs to be modidifed in sql, chnges were made
            url: '/images',
            routes : {
                post : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const request = await pool.request()
                        .input( 'UUID',  req.body.UUID )
                        .input( 'TITLE',  req.body.TITLE )
                        .input( 'IMGNAME',  req.body.IMGNAME )
                        .execute( 'InsertImage', (err, response) => {
                            res.status( 200 ).json( { message: 'success', data: response.recordset } )
                        })
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },
        {
            url: '/images/imgcount',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `execute [dbo].[getProductsAndImgCount]` )
                        
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },
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
