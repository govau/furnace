/**
 *
 * Prepare the request and response for the express server.
 *
 * HandlePost - Handle the POST request and response.
 *
 */

'use strict';

import Sass from 'node-sass';
import Autoprefixer from 'autoprefixer';
import Postcss from 'postcss';

import { SETTINGS } from './settings';
import { Log } from './helper';

/**
 * Promise that uses a sass @import string to resolve minified, autopreffixed css
 *
 * @param sassString
 */
export const GetMinCss = ( sassString ) => {
	Log.verbose( `Running GetMinCss`);

	return new Promise( ( resolve, reject ) => {
		Sassify( sassString )
			.then( Autoprefix )
			.then( cssMin => resolve( cssMin ) )
			.catch( error => reject( error ) );
	});

}


/**
 * Compile Sass code into CSS (modified from the uikit helper.js)
 *
 * @param  {string} scss - The Sass file to be compiled
 * @param  {string} css  - The location where the CSS should be written to
 */
export const Sassify = ( scss ) => {
	Log.verbose( `Running Sassify`);

	return new Promise( ( resolve, reject ) => {
		Sass.render({
			data: scss,
			indentType: 'tab',
			precision: 8,
			outputStyle: 'compressed',
		}, ( error, result ) => {
			if ( result && !error ) {
				resolve( result.css.toString() );
			}
			reject( error );
		})
	});
};


/**
 * Autoprefix a css file (modified from the uikit helper.js)
 *
 * @param  {string} file - The file to be prefixed
 */
export const Autoprefix = ( css ) => {
	Log.verbose( `Running Autoprefix`);

	return new Promise ( ( resolve, reject ) => {

		Postcss([ Autoprefixer({ browsers: ['last 2 versions', 'ie 8', 'ie 9', 'ie 10'] }) ])
			.process( css )
			.then( ( prefixed ) => {
				prefixed
					.warnings()
					.forEach( ( warn ) => console.warn( warn.toString() ) );

				resolve( prefixed.css );
			})
			.catch( error => reject( error ) );
	})
};
