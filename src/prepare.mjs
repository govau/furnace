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
import { GetDepTree } from './dependencies';


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

	Log.verbose( `Melting the component strings into filenames`);

	HandleData( data )
		.then( GetSass )
		.then( data => {
			Log.info(`Finished the furnace`);
			console.log( data );
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

		let dependencies = JSON.parse( Fs.readFileSync( SETTINGS.uikit.json, "utf-8" ) );

		let components = GetComponents( dependencies, data.components );


		// Get the SASS/JS files from the dependencies first then components
		let sass = [];
		let js = [];

		components.map( component => {

			// Get the directory or files
			let sassDir = `${ SETTINGS.uikit.components + component }/src/sass/`;
			let jsFile = `${ SETTINGS.uikit.components + component }/src/js/${ data.framework }.js`;


			// Check that the file exists before adding it
			if ( Fs.existsSync( sassDir ) ) { sass.push( sassDir ); }
			if ( Fs.existsSync( jsFile ) ) { js.push( jsFile ); }

		});

		resolve({
			"sass": sass,
			"js": js,
			"buildOptions": data.buildOptions,
			"framework": data.framework,
		})
	});

};



/**
 * GetComponents - Gets the components with dependencies.
 *
 * @param uikitJson - The file where the dependencies live
 */
export const GetComponents = ( dependencies, components ) => {

	// Get the arrays of dependencies for each component
	dependencies = components.map( component => {
		let componentDependencies = GetDepTree( `@gov.au/${ component }`, dependencies );
		return [ ...new Set( Flatten( componentDependencies ) ) ];
	});

	// Flatten and find unique dependencies and components
	components = [ [].concat.apply([], dependencies) , components ];
	return [ 'core', ...new Set( [].concat( ...components ) ) ];

}



/**
 * Flatten a deep object into a one level array
 *
 * @param  {object} object - The object to be flattened
 *
 * @return {array}         - The resulting flat array
 */
export const Flatten = object => {
	return [].concat( ...Object.keys( object ).map( key =>
		Object.keys( object[ key ] ).length > 0
			? [ key, ...Flatten( object[ key ] ) ]
			: key
		)
	);
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
