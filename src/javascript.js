/**
 *
 * Prepare the request and response for the express server.
 *
 * HandlePost - Handle the POST request and response.
 *
 */

'use strict';

import Fs from 'fs';
import UglifyJs from 'uglify-js';

import { ReadFile } from './files';
import { SETTINGS } from './settings';
import { Log } from './helper';


/**
 * GetJs - From the js directories create a minified js file
 *
 * @return data - The package containing the sassDirs, jsDirs, options selected and files
 */
export const GetMinJs = ( jsFiles ) => {
	Log.verbose( `Running GetMinJs` );

	return new Promise ( ( resolve, reject ) => {
		let js = [];

		if ( jsFiles.length <= 0 ) {
			reject( 'The jsFiles must have at least one file' );
		}

		// For each JS file read the file and add it to the string.
		jsFiles.map( jsFile => {
			js.push( ReadFile( jsFile ) );
		});

		Promise.all( js )
			.then( jsStringArray =>  jsStringArray.join('') )
			.then( jsString => Uglify( jsString ) )
			.then( js => resolve( js.code ) )
			.catch( error => reject( error ) );

	})
}


export const Uglify = ( js ) => {
	Log.verbose( `Running Uglify` );

	return new Promise( ( resolve, reject ) => {

		const minJs = UglifyJs.minify( js );

		if( minJs.error ) {
			reject( minJs.error );
		}
		else {
			resolve( minJs );
		}
	});
}
