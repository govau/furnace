/***************************************************************************************************************************************************************
 *
 * Prepare the request and response for the express server
 *
 * HandlePost - Handle the POST request and response
 * HandleData - Get the paths based on the jsOutput and components chosen
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path     from 'path';
import Fs       from 'fs';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Settings }           from './settings';
import { Log }                from './helper';
import { CompileZip, GetZip } from './zip';
import { Bundle }             from './bundle';
import { GetDependencies }    from './dependencies';


/**
 * HandlePost - Handle the POST request and response
 *
 * @param  {object} request  - The data passed from the express POST
 * @param  {object} response - The data returned to the express server
 */
export const HandlePost = ( request, response ) => {
	Log.verbose( `Running HandlePost`);

	let data = request.body;

	Log.verbose( `Melting the component strings into filenames`);

	HandleData( data )
		.then( Bundle )
		.then( zip => GetZip( response, zip ) )
		.catch( error => {
			Log.error( error );
			response.status( 400 ).send( `400: ${ error }` );
		});

}

/**
 * HandleData - Get the paths based on the jsOutput and components chosen
 *
 * @param  {object} data        - The request.body returned from the form
 *
 * @return {object}             - The object to be passed to the bundle
 * @return {object}.components  - The components and there dependencies
 * @return {object}.styleOutput - The styleOutput option selected by the user
 * @return {object}.jsOutput    - The jsOutput option selected by the user
 */
export const HandleData = ( data ) => {
	Log.verbose( `Running HandleData `);

	return new Promise( ( resolve, reject ) => {

		if( !data.components ) {
			reject( `No components selected` );
		}
		else {
			// Format the data so that it's in an array
			const components = typeof data.components === 'string' ? [ data.components ] : data.components;
			const styleOutput = typeof data.styleOutput === 'string' ? [ data.styleOutput ] : data.styleOutput;
			const jsOutput = typeof data.jsOutput === 'string' ? [ data.jsOutput ] : data.jsOutput;

			resolve({
				components: GetDependencies( components ),
				styleOutput: Settings.get().uikit.styleOutput[ data.styleOutput ].option,
				jsOutput: Settings.get().uikit.jsOutput[ data.jsOutput ].option,
			})
		}
	});

};



