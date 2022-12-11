const fs = require('fs');

let registerRoutes = function( router ) {
    //const self = this;
    const BASE_DIR = process.cwd() + '/routes';

    let routes = fs.readdirSync(BASE_DIR );
    
    routes.forEach( dir => {
        // Get all of the files in the specified directory
        let files = fs.readdirSync(BASE_DIR + '/' + dir);

        // Traverse through the files/directories
        for (let path of files) {
            console.log(path)
            let filePath = BASE_DIR + '/' + dir + '/' + path;

            let stats = fs.lstatSync(filePath);

            // If file, then register route
            if (stats.isFile()) {
                console.info("Registering routes: ", dir);
                let endpoint = require(filePath);

                endpoint['routes'].forEach( route => {
                    let endpointUrl = route['url'];
                    console.log(endpointUrl)
                    Object
                    .keys(route['routes'])
                    .forEach((method) => {
                        // Create the endpoint URL
                        console.info("\t Creating route [%s]: %s", method, endpointUrl);

                        // Register the route
                        router[method](endpointUrl, route['routes'][method]);
                    });
                    
                } )
            }

            // If directory, then loop through this directory and register routes
            if ( stats.isDirectory() ) {
                registerRoutes( dir + '/' + path );
            }
        }

    }) 
}

module.exports = {
    registerRoutes
}