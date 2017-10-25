/**
 *
 * Prepare the request and response for the express server.
 *
 * HandlePost - Handle the POST request and response.
 *
 */

'use strict';

// Dependencies
import Path from 'path';
import Archiver from 'archiver';
import Fs from 'fs';


// Local dependencies
import { SETTINGS } from './settings';
import { Log } from './helper';
import { CompileZip, GetZip } from './zip';
import { GetFiles } from './files';
import { GetDependencies } from './dependencies';


/**
 * HandlePost - Handle the POST request and response.
 *
 * @param request - The data passed from the express POST
 * @param response - The data returned to the express server
 *
 */
export const HandlePost = ( request, response ) => {
	Log.verbose( `Running HandlePost`);

	let data = request.body;
	const buildOptions = data.buildOptions;

	Log.verbose( `Melting the component strings into filenames`);

	HandleData( data )
		.then( GetFiles )
		// .then( Bundler )
		.then( files => GetZip( files, response ) )
		.catch( error => {
			Log.error( error );
			response.status( 400 ).send( `400: ${ error }` );
		});

}

/**
 * HandleData - Get the paths based on the framework and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const HandleData = ( data ) => {
	Log.verbose( `Running HandleData `);

	return new Promise( ( resolve, reject ) => {

		// If there is one option, put it into an array.
		const components = typeof data.components === 'string' ? [ data.components ] : data.components;
		const buildOptions = typeof data.buildOptions === 'string' ? [ data.buildOptions ] : data.buildOptions;
		const framework = typeof data.framework === 'string' ? [ data.framework ] : data.framework;

		// Resolve the data object and push it through the system
		resolve ({
			components: GetDependencies( components ),
			buildOptions: buildOptions,
			framework: framework
		});

	});

};


// To do
// Add param/return type in JSdocs comments
// Write jest tests for each function - more pure more testable functions
// 100% testable functions as good as we can with filesystem!









////////////////////
///
////
///
///
// ZIP STUFF NEED THIS


// const files = AddFile( data.components, 'test.txt', [] );



// Create the response with all of the data and send it as a response

// response.writeHead(200, {
// 	'Content-Type': `application/zip`,
// 	'Content-disposition': `attachment; filename=Nugget.zip`,
// });


// zipFile.pipe( response );


// CompileZip( zipFile, files );
