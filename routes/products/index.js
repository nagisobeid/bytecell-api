
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
                }
            }
        },
        {
            url: '/products/shopify/variants/seeding',
            routes: {
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
        /*
        {
            url: '/xxproducts/shopify/variants/seeding',
            routes: {
                post : async ( req, res ) => {
                    //console.log( req.body )
                    const table = new db.sql.Table('[VariantKey]') // or temporary table, e.g. #temptable
                    table.create = false

                    table.columns.add('SHPFY_ID', db.sql.VarChar(50), {nullable: false}),
                    table.columns.add('BYTECELL_ID', db.sql.VarChar(50), {nullable: false})

                    for( let i = 0; i < req.body.VARIANTS.length; i++ ) {
                        table.rows.add( req.body.VARIANTS[i].SHPFY_ID.toString(), req.body.VARIANTS[i].BYTECELL_ID.toString() )
                    }

                    const request = db.appPool.request()
                    request.bulk(table, (err, result) => {
                        res.status( 200 ).json( { message: 'success', data: result } )
                    })
                }
            }
        },
        {
            url: '/xxproducts/shopify/variants/seeding',
            routes: {
                post : async ( req, res ) => {
                    let failed = 0
                    let failedList = []
                    for( let i = 0; i < req.body.VARIANTS.length; i++ ) {
                        try {
                            let response = await executeSproc( 'InsertVariantKey', req.body.VARIANTS[i] )
                            if ( response.status === 'failed' ) {
                                failed++
                                failedList.push( req.body.VARIANTS[i].BYTECELL_ID  )
                            }
                            
                        } catch ( e ) {
                            res.status( 500 ).json( { message: 'error', data: e.message } )
                            return
                        }
                    }
                    res.status( 200 ).json( { message: 'success', data: { 'inserted' : req.body.VARIANTS.length - failed, 'failed' : { 'count' : failed, 'list' : failedList } } } )
                    return
                }
            }
        },
        */
        {
            url: '/products/checkprices',
            routes : {
                get : async ( req, res ) => {
                    console.log( req.query )
                    try {
                        let response = await executeSproc( 'getUuidsForPriceChecks', req.query )
                        res.send( response.recordsets[0] )
                    } catch ( err ) {
                        res.status( 500 ).json( err )
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
                } 
            } 
        },
        {
            url: '/products/shopify',
            routes : {
                get : async ( req, res ) => {
                    try {
                        let response = await executeSproc( 'getProductsForShopify' )
                        if ( response.status === 'failed' ) {
                            res.status( 500 ).json( { message: 'error', data: response } )
                            return
                        }
                        res.status( 200 ).json( { message: 'success', data: response.data.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                    /*
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `execute [dbo].[getProductsForShopify]` )
                        
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }*/
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
                    /*try {
                        const pool = await db.appPool
                        const request = await pool.request()
                        .input( 'UUID',  req.body.UUID )
                        .input( 'INSHPFY',  req.body.INSHPFY )
                        .input( 'SHPFYID',  req.body.SHPFYID )
                        .execute( 'UpdateProdSyncStatus', (err, response) => {
                            if (err) {
                                res.status( 500 ).json( { message: 'error', data: err } )
                                return
                            }
                            res.status( 200 ).json( { message: 'success', data: response } )
                        })
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }*/
                } 
            } 
        },
        {/*
                    @UUID nvarchar(MAX) = Null,
                    @CONDITION nvarchar(MAX) = Null,
                    @PRICE MONEY = Null,
                    @BMPRICE MONEY = Null,
                    @AVAILSTATUS BIT = Null
        */
                    url: '/products',
                    routes : {
                        put : async ( req, res ) => {
                            try {
                                let response = await executeSproc( 'updateProducts', req.body )
                                res.send( response )
                            } catch ( err ) {
                                res.status( 500 ).json( err )
                                return
                            }
                        } 
                    } 
                },
        {/*
                    @UUID nvarchar(MAX) = Null,
                    @CONDITION nvarchar(MAX) = Null,
                    @PRICE MONEY = Null,
                    @BMPRICE MONEY = Null,
                    @AVAILSTATUS BIT = Null
        */
            url: '/xxproducts',
            routes : {
                put : async ( req, res ) => {
                    let failed = 0
                    let failedList = []
                    for( let i = 0; i < req.body.PRODUCTS.length; i++ ) {
                        try {
                            let response = await executeSproc( 'UpdateProduct', req.body.PRODUCTS[i] )
                            if ( response.status === 'failed' ) {
                                failed++
                                failedList.push( req.body.PRODUCTS[i].UUID  )
                            }
                            
                        } catch ( e ) {
			                //console.log( e )
			                res.status( 500 ).json( { message: 'error', data: e.message } )
                            return
                        }
                    }
                    res.status( 200 ).json( { message: 'success', data: { 'updated' : req.body.PRODUCTS.length - failed, 'failed' : { 'count' : failed, 'list' : failedList } } } )
                    return
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
    ] 
};

