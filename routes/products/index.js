
const db = require( '../../db' )

module.exports = {
    routes: [
        {
            url: '/products/ids',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `select UUID from [dbo].${process.env.DB_TABLE_PRODS} group by UUID` )
                
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },
        {
            url: '/products',
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
            url: '/products/:uuid',
            routes: {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .input( 'uuid', db.sql.VarChar, req.params.uuid )
                        .query( `select * from [dbo].${process.env.DB_TABLE_PRODS} where uuid = @uuid` )
                
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                }
            }
        },
        {
            url: '/products/:uuid/:color/:condition',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const request = await pool.request()
                        .input( 'uuid', db.sql.VarChar, req.params.uuid )
                        .input( 'color', db.sql.VarChar( 255 ), req.params.color )
                        .input( 'condition', db.sql.VarChar( 225 ), req.params.condition )
                        .execute( 'getProduct', (err, response ) => {
                    
                            res.status( 200 ).json( { message: 'success', data: response.recordset } )
                        })
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }  
                }
            }
        },
        //router
    ] 
};


//module.exports = router