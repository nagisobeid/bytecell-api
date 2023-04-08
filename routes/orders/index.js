
const { MAX } = require('mssql');
const db = require( '../../db' )
const executeSproc = require('../../util/executeSproc')
//const bulkInsert = require( '../../util/bulkInsert' )
const bulkActions = require( '../../util/bulk' )

module.exports = {
    routes: [
        
        {
            url: '/orders',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        pool.request()
                        .query( `SELECT * FROM [dbo].${process.env.DB_TABLE_ORDERS}`, ( err, response ) => {
                            if (err) {
                                res.status( 500 ).json( { message: 'error', data: err } )
                                return
                            }
                            res.status( 200 ).json( response.recordset  )
                        } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                },
                post : async ( req, res ) => {

                    const tableName = '[Orders]'

                    //console.log( db.sql )

                    const columns = {
                        id : { DataType : db.sql.VarChar, Nullable : { nullable: false } },
                        variant_id : { DataType : db.sql.VarChar, Nullable : { nullable: true } },
                        browser_ip : { DataType : db.sql.VarChar, Nullable : { nullable: true } },
                        checkout_id : { DataType : db.sql.VarChar, Nullable : { nullable: true } },
                        created_at : { DataType : db.sql.VarChar, Nullable : { nullable: true } },
                        processed_at : { DataType : db.sql.VarChar, Nullable : { nullable: true } },
                        subtotal_price : { DataType : db.sql.Money, Nullable : { nullable: true } },
                        total_price : { DataType : db.sql.Money, Nullable : { nullable: true } },
                        order_number : { DataType : db.sql.VarChar, Nullable : { nullable: true } }
                    }

                    const data = req.body.ORDERS
                    //console.log( data )

                    const table = bulkActions.insert( tableName , columns, data )
                    const request = db.appPool.request()
                    request.bulk(table, (err, result) => {
                        if ( err ) {
                            console.log( err )
                            res.status( 500 ).json( 'ERROR' )
                            return
                        }
                        res.status( 200 ).json( result )
                    })

                    //console.log( j )
                    
                }
            } 
        }
    ] 
};

