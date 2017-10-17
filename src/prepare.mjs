/**
 *
 * Prepare the request and response for the express server.
 *
 * HandlePost - Handle the POST request and response.
 *
 */

'use strict';

// Dependencies
import Fs from 'fs';
import Path from 'path';
import Archiver from 'archiver';


// Local dependencies
import { SETTINGS } from './settings';
import { Log } from './helper';
import { AddFile, CompileZip } from './zip';
import { GetCss } from './css';
import { GetSass } from './sass';
import { GetJs } from './javascript';
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

	const zipFile = Archiver(`zip`);

	let data = request.body;
	const buildOptions = data.buildOptions;

	Log.verbose( `Melting the component strings into filenames`);

	HandleData( data )
		.then( data => {
			// Get the CSS
			if ( buildOptions.includes( 'minifycss' ) ) {
				data.zip.css = GetCss( data.sass );
			}
			return data;
		})
		.then( data => {
			// Get the JS
			data.zip.js = GetJS( data.js );
			return data;
		})
		.then( data => {

			response.writeHead(200, {
				'Content-Type': `application/zip`,
				'Content-disposition': `attachment; filename=Nugget.zip`,
			});

			zipFile.pipe( response );

			CompileZip( zipFile, data.css );
		})
		.catch( error => {
			Log.error( error );
		});

}

/**
 * HandleData - Get the paths based on the framework and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const HandleData = ( data ) => {
	Log.verbose( `Running HandleData`);

	return new Promise( (resolve, reject ) => {

		const uikit = JSON.parse( Fs.readFileSync( SETTINGS.uikit.json, "utf-8" ) );

		let components = GetDependencies( uikit, data.components );

		// Get the SASS/JS files from the dependencies first then components
		let sass = [];
		let js = [];

		components.map( component => {

			// Get the directory or files
			let sassDir = `${ SETTINGS.uikit.components + component }/lib/sass/`;
			let jsFile = `${ SETTINGS.uikit.components + component }/lib/js/${ data.framework }.js`;


			// Check that the file exists before adding it
			if ( Fs.existsSync( sassDir ) ) { sass.push( sassDir ); }
			if ( Fs.existsSync( jsFile ) ) { js.push( jsFile ); }

		});

		resolve({
			"sass": sass,
			"js": js,
		})
	});

};












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
