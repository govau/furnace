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
import Archiver from 'archiver';

// Local dependencies
import { SETTINGS } from './settings';
import { Log } from './helper';
import { AddFile, CompileZip } from './zip';


/**
 * HandlePost - Handle the POST request and response.
 *
 * @param request - The data passed from the express POST
 * @param response - The data returned to the express server
 *
 */
export const HandlePost = ( request, response ) => {
	Log.verbose( `Running HandlePost`);

	const data = request.body;
	const zipFile = Archiver(`zip`);


	Log.verbose( `Melting the component strings into filenames`);
	data.components = data.components.toString();


	// Pure functions that we can have mock files for and test cleanly
	const files = AddFile( data.components, 'test.txt', [] );


	response.writeHead(200, {
		'Content-Type': `application/zip`,
		'Content-disposition': `attachment; filename=Nugget.zip`,
	});


	zipFile.pipe( response );


	CompileZip( zipFile, files );

}


	// components = components.map( component => {

	// 	let data = {};

	// 	let sass = `${ SETTINGS.get().uikit.root + component }/src/sass/_module.scss`;
	// 	let js = `${ SETTINGS.get().uikit.root + component }/src/js/${ framework }.js`;

	// 	if ( Fs.existsSync( sass ) ) { data.sass = sass; }
	// 	if ( Fs.existsSync( js ) ) { data.js = js; }

	// 	return data;

	// });
