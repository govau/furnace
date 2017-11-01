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

		// For each JS file read the file and add it to the string.
		jsFiles.map( jsFile => {
			js.push( ReadFile( `uikit/${ jsFile }` ) );
		});

		js = Promise.all( js )
			.then( jsStringArray => data.toString() )
			.then( jsString => UglifyJs.minify( jsString ) )
			.catch( error => reject( error ) );

		resolve( js );
	})
}
