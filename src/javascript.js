/***************************************************************************************************************************************************************
 *
 * Javascript file uglification
 *
 * GetMinJs - Turn the js file paths into a string of js
 * Uglify   - Promisified uglification of a js string
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Fs       from 'fs';
import UglifyJs from 'uglify-js';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { ReadFile } from './files';
import { Log }      from './helper';


/**
 * GetMinJs - From the js files create a minified js file
 *
 * @param  {array}  jsFiles - An array of paths to js files
 *
 * @return {string} js.code - The uglified js as one string
 */
export const GetMinJs = ( jsFiles ) => {
	Log.verbose( `Running GetMinJs` );

	return new Promise ( ( resolve, reject ) => {
		let js = [];

		if( jsFiles.length <= 0 ) {
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

/**
 * Uglify - Minify the js in a promise with errors
 *
 * @param  {string} js      - A string with all of the javascript
 *
 * @return {string} minJs   - The minified js
 */
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
