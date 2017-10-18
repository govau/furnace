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
import { AddFile } from './zip';


/**
 * GetJs - From the js directories create a minified js file
 *
 * @return data - The package containing the sassDirs, jsDirs, options selected and files
 */
export const GetJs = ( data ) => {
	Log.verbose( `Running GetJs`);

	let js = "";

	// For each JS file read the file and add it to the string.
	data.js.map( jsFile => {
		js = js + Fs.readFileSync( jsFile );
	});

	// Uglify the JS
	js = UglifyJs.minify( js );

	// Change the folder based on what framework is chosen
	const framework = data.framework === 'module' ? 'js' : data.framework;

	data.files = AddFile( js.code, `${ framework }/script.min.js`, data.files );

	return data;
}
