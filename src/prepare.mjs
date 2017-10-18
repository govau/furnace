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
import { CompileZip } from './zip';
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
		.then( GetCss )
		.then( GetJs )
		.then( data => {

			// --- MAKE A FUNCTION FOR THIS ---
			response.writeHead(200, {
				'Content-Type': `application/zip`,
				'Content-disposition': `attachment; filename=Nugget.zip`,
			});

			zipFile.pipe( response );

			CompileZip( zipFile, data.files );

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

	return new Promise( ( resolve, reject ) => {

		// Get the components
		let components = GetDependencies( data.components );

		components = ['core', ...new Set(components)];

		// Get the SASS/JS files from the dependencies first then components
		let sass = [];
		let js = [];

		components.map( component => {
			let sassDir = `${ SETTINGS.uikit.componentsDir + component }/lib/sass/`;
			let jsFile = `${ SETTINGS.uikit.componentsDir + component }/lib/js/${ data.framework }.js`;

			if( Fs.existsSync( sassDir ) ) { sass.push( sassDir ); }
			if( Fs.existsSync( jsFile ) ) { js.push( jsFile ); }
		});

		resolve ({
			sass: sass,
			js: js,
			framework: data.framework,
			buildOptions: data.buildOptions,
			files: [],
		});

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
