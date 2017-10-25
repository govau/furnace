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
 * Compile Sass code into CSS (modified from the uikit helper.js)
 *
 * @param  {string} scss - The Sass file to be compiled
 * @param  {string} css  - The location where the CSS should be written to
 */
export const GetMinCss = ( sassString ) => {
	Log.verbose( `Running GetMinCss`);

	// Needs autoprefixer
	return Sassify( sassString );

}


/**
 * Compile Sass code into CSS (modified from the uikit helper.js)
 *
 * @param  {string} scss - The Sass file to be compiled
 * @param  {string} css  - The location where the CSS should be written to
 */
const Sassify = ( scss ) => {
	Log.verbose( `Running Sassify`);

	const compiled = Sass.renderSync({
		data: scss,
		indentType: 'tab',
		precision: 8,
		outputStyle: 'compressed',
	});

	return compiled.css.toString();
};


/**
 * Autoprefix a css file (modified from the uikit helper.js)
 *
 * @param  {string} file - The file to be prefixed
 */
const Autoprefix = ( css ) => {
	Log.verbose( `Running Autoprefix`);

	return Postcss([ Autoprefixer({ browsers: ['last 2 versions', 'ie 8', 'ie 9', 'ie 10'] }) ])
		.process( css )
		.then( ( prefixed ) => {
			prefixed
				.warnings()
				.forEach( ( warn ) => {
					console.warn( warn.toString() );
			});

			return prefixed.css;
	});

};
