const db = require( '../../db' )

module.exports = {
    routes: [
        {
            url: '/test',
            routes : {
                get : async ( req, res ) => {
                    console.log(req.socket)
                    res.send(req.socket.remoteAddress)
                    //console.log(req.socket.remoteAddress)
                } 
            } 
        },
    ]
}
