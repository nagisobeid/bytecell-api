const db = require( '../../db' )

module.exports = {
    routes: [
        {
            url: '/reviews',
            routes : {
                post : async ( req, res ) => {
                    for( let i = 0; i < req.body.REVIEWS.length; i++ ) {
                        try {
                            const pool = await db.appPool
                            const request = await pool.request()
                            .input( 'UUID',  req.body.REVIEWS[i].UUID )
                            .input( 'FN',  req.body.REVIEWS[i].FN )
                            .input( 'LN',  req.body.REVIEWS[i].LN )
                            .input( 'DATEREVIEW',  req.body.REVIEWS[i].DATEREVIEW )
                            .input( 'DATEPURCHASE',  req.body.REVIEWS[i].DATEPURCHASE )
                            .input( 'RATE',  req.body.REVIEWS[i].RATE )
                            .input( 'COMMENT',  req.body.REVIEWS[i].COMMENT )
                            .execute( 'InsertReview', (err, response) => {
                                //ok
                            })
                        } catch ( err ) {
                            res.status( 500 ).json( { message: 'error', data: err } )
                        }
                    }
                    res.status( 200 ).json( { message: 'success', data: 'NODATA' } )
                } 
            } 
        },
        /*{
            url: '/reviews',
            routes : {
                post : async ( req, res ) => {
                    //req.body.REVIEWS
                    for( let i = 0; i < req.body.REVIEWS.length; i++ ) {

                    }
                    try {
                        const pool = await db.appPool
                        const request = await pool.request()
                        .input( 'UUID',  req.body.UUID )
                        .input( 'FN',  req.body.FN )
                        .input( 'LN',  req.body.LN )
                        .input( 'DATEREVIEW',  req.body.DATEREVIEW )
                        .input( 'DATEPURCHASE',  req.body.DATEPURCHASE )
                        .input( 'RATE',  req.body.RATE )
                        .input( 'COMMENT',  req.body.COMMENT )
                        .execute( 'InsertReview', (err, response) => {
                            res.status( 200 ).json( { message: 'success', data: response.recordset } )
                        })
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },*/
        {
            url: '/reviews/missing',
            routes : {
                get : async ( req, res ) => {
                    try {
                        const pool = await db.appPool
                        const result = await pool.request()
                        .query( `execute [dbo].[getProductsWithoutReviews]` )
                        
                        res.status( 200 ).json( { message: 'success', data: result.recordset } )
                    } catch ( err ) {
                        res.status( 500 ).json( { message: 'error', data: err } )
                    }
                } 
            } 
        },
    ]
}
