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
import { PrepareBundle, Bundle } from './bundle';
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

	Log.verbose( `Melting the component strings into filenames`);

	HandleData( data )
		.then( PrepareBundle )
		.then( Bundle )
		.then( () => GetZip( response ) )
		.catch( error => {
			Log.error( error );
			response.status( 400 ).send( `400: ${ error }` );
		});

}

/**
 * HandleData - Get the paths based on the jsOutput and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const HandleData = ( data ) => {
	Log.verbose( `Running HandleData `);

	return new Promise( ( resolve, reject ) => {

		if ( !data.components ) {
			reject( `No components selected` );
		}

		// If there is one option, put it into an array.
		const components = typeof data.components === 'string' ? [ data.components ] : data.components;
		const styleOutput = typeof data.styleOutput === 'string' ? [ data.styleOutput ] : data.styleOutput;
		const jsOutput = typeof data.jsOutput === 'string' ? [ data.jsOutput ] : data.jsOutput;

		resolve({
			components: GetDependencies( components ),
			styleOutput: SETTINGS.uikit.styleOutput[ data.styleOutput ].option,
			jsOutput: SETTINGS.uikit.jsOutput[ data.jsOutput ].option,
		})

	});

};



