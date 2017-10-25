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

import { SETTINGS } from './settings';
import { Log } from './helper';


/**
 * GetJs - From the js directories create a minified js file
 *
 * @return data - The package containing the sassDirs, jsDirs, options selected and files
 */
export const GetMinJs = ( jsFiles ) => {
	Log.verbose( `Running GetMinJs` );

	let js = "";

	// For each JS file read the file and add it to the string.
	jsFiles.map( jsFile => {
		js = js + Fs.readFileSync( jsFile );
	});

	// Uglify the JS
	js = UglifyJs.minify( js );

	return js.code;
}
