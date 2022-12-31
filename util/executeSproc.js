const db = require( '../db' )


//module.exports = {
function executeSproc ( sprocName, params={} ) {
    return new Promise( (resolve, reject) => {
        const req = db.appPool.request()
       
        for ( const [key, value] of Object.entries( params ) ) {
            req.input( key, value )
        }
        
        req.execute( sprocName, ( err, response ) => {
            if ( err ) {
                reject( err )
            } else {
                resolve( response )
            }
        })
    } )

    //return promise
}

module.exports = executeSproc
//}