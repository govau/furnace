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
import Path            from 'path';
import Fs              from 'fs';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Settings }           from './settings';
import { Log }                from './helper';
import { CompileZip, GetZip } from './zip';
import { Bundle }             from './bundle';
import { GetDependencies }    from './dependencies';
import { SlackMessage }       from './slack';


/**
 * HandlePost - Handle the POST request and response
 *
 * @param  {object} request  - The data passed from the express POST
 * @param  {object} response - The data returned to the express server
 */
export const HandlePost = ( request, response ) => {
	Log.verbose( `Running HandlePost`);

	const ip = request.headers['x-forwarded-for']
		? `${ request.headers['x-forwarded-for'].split(',')[0] }`
		: `${ request.connection.remoteAddress }`;
	Log.message( `New request from: ${ ip }`);

	let data = request.body;

	if( !data.components ) {
		Log.error( `No components selected` );
	}
	else {
		// Format the data so that it's in an array
		const components = typeof data.components === 'string' ? [ data.components ] : data.components;
		const styleOutput = Settings.get().uikit.styleOutput[ data.styleOutput ].option;
		const jsOutput = Settings.get().uikit.jsOutput[ data.jsOutput ].option;

		Log.message( `${ components.length } components: ${ components.join(', ') }` );
		Log.message( `Style output: ${ data.styleOutput }` );
		Log.message( `JS output:    ${ data.jsOutput }` );

		const formattedRequest = {
			components: components,
			styleOutput: styleOutput,
			jsOutput: jsOutput,
			ip: ip
		};

		Bundle( formattedRequest )
			.then( zip => GetZip( response, zip ) )
			.then( () => SlackMessage( formattedRequest ) )
			.catch( error => {
				Log.error( error );
				response.status( 400 ).send( `400: ${ error }` );
			});
	}
}
