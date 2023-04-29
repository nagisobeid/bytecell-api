
const { MAX } = require('mssql');
const db = require( '../../db' )
const executeSproc = require('../../util/executeSproc')
//const bulkInsert = require( '../../util/bulkInsert' )
const bulkActions = require( '../../util/bulk' )

module.exports = {
    routes: [
        {
            url: '/products/ids',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `SELECT UUID FROM [dbo].${process.env.DB_TABLE_PRODS} GROUP BY UUID` )
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: err } )
                    }
                } 
            } 
        },
        {
            url: '/products/pricechanged',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const result = await db.appPool.request()
                            .query( `SELECT * FROM [dbo].[vwGetVariantsWithPriceChange]` )
                        res.send( result.recordset )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: err } )
                    }
                } 
            } 
        },
        {
            url: '/products/shopify/variants/seeding',
            routes: {
                get : async ( req, res ) => {
                    try {
                        //const pool = await db.appPool
                        const result = await db.appPool.request()
                        .query( `SELECT * FROM vwGetProdsForVariantSeedingShopify` )
                
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                },
                post : async ( req, res ) => {

                    const tableName = '[VariantKey]'

                    const columns = {
                        SHPFY_ID : { DataType : db.sql.VarChar(50), Nullable : { nullable: false } },
                        BYTECELL_ID : { DataType : db.sql.VarChar(50), Nullable : { nullable: false } }
                    }

                    const data = req.body.VARIANTS

                    const table = bulkActions.insert( tableName , columns, data )
                    const request = db.appPool.request()
                    request.bulk(table, (err, result) => {
                        res.status( 200 ).json( result )
                    })
                    
                }
            }
        },
        {
            url: '/products/checkprices',
            routes : {
                get : async ( req, res ) => {
                    console.log( req.query )
                    try {
                        let response = await executeSproc( 'getUuidsForPriceChecks', req.query )
                        res.send( response.recordsets[0] )
                    } catch ( err ) {
			            console.log( err )
                        res.status( 500 ).json( err )
                    }
                } 
            } 
        },
        {
            url: '/products/shopify',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const result = await db.appPool.request()
                            .query( `SELECT * FROM [dbo].[vwGetProductsForShopify]` )
                        res.send( result.recordset )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: err } )
                    }
                } 
            } 
        },
        {
            url: '/products/syncstatus',
            routes : {
                post : async ( req, res ) => {
                    try {
                        let response = await executeSproc( 'UpdateProdSyncStatus', req.body )
                        if ( response.status === 'failed' ) {
                            res.status( 500 ).json( { message: 'error', data: response } )
                            return
                        }
                        res.status( 200 ).json( { message: 'success', data: response.data.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },
        {
            url: '/products/force-price-changed',
            routes : {
                get : async ( req, res ) => {
                    try {
                        let response = await executeSproc( 'forcePriceChanged' )
                        res.send( response )
                    } catch ( err ) {
                        console.log( err )
                        res.status( 500 ).json( err )
                        return
                    }
                } 
            } 
        },
        {
            url: '/products/resetpricechanged',
            routes : {
                put : async ( req, res ) => {
                    try {
                        let response = await executeSproc( 'resetPriceChangedValues', req.body )
                        res.send( response )
                    } catch ( err ) {
                        res.status( 500 ).json( err )
                        return
                    }
                } 
            } 
        },
        {
            url: '/products/:uuid/:color/:condition',
            routes : {
                get : async ( req, res ) => {
                    try {
                        let response = await executeSproc( 'getProduct', req.params )
                        if ( response.status === 'failed' ) {
                            res.status( 500 ).json( { message: 'error', data: response } )
                            return
                        }
                        res.status( 200 ).json( { message: 'success', data: response.data.recordset } )
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
            url: '/products',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        pool.request()
                        .query( `SELECT * FROM [dbo].${process.env.DB_TABLE_PRODS}`, ( err, response ) => {
                            if (err) {
                                res.status( 500 ).json( { message: 'error', data: err } )
                                return
                            }
                            res.status( 200 ).json( { message: 'success', data: response.recordset } )
                        } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                },
                put : async ( req, res ) => {
                    try {
                        let response = await executeSproc( 'updateProducts', req.body )
                        res.send( response )
                    } catch ( err ) {
                        console.log( err )
                        res.status( 500 ).json( err )
                        return
                    }
                } 
            } 
        },
    ] 
};

