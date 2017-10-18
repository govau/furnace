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
import { AddFile } from './zip';


/**
 * GetCss - From the sass directories create a minified js file
 *
 * @return data - The package containing the sassDirs, jsDirs, options selected and files
 */
export const GetCss = ( data ) => {
	Log.verbose( `Running GetCSS`);

	let css = "";

	// Add sass versioning to the start
	css = `@import '${ SETTINGS.node_modules.sassVersioning }';\n\n`;

	// Add the directories to the string
	data.sass.map( sassDir => {
		css = css + `@import '${ sassDir }_module.scss';\n`;
	});

	Sassify( css );
	Autoprefix( css );

	data.files = AddFile( css, 'css/styles.min.css', data.files );

	return data;

}



/**
 * Compile Sass code into CSS (modified from the uikit helper.js)
 *
 * @param  {string} scss - The Sass file to be compiled
 * @param  {string} css  - The location where the CSS should be written to
 */
const Sassify = ( scss ) => {
	Log.verbose( `Running Sassify`);

	let compiledCss = Sass.renderSync({
		data: scss,
		indentType: 'tab',
		precision: 8,
		includePaths: [ './lib/sass/' ],
		outputStyle: 'compressed',
	});

	return compiledCss.css.toString();
};


/**
 * Autoprefix a css file (modified from the uikit helper.js)
 *
 * @param  {string} file - The file to be prefixed
 */
const Autoprefix = ( css ) => {
	Log.verbose( `Running Autoprefix`);
	Postcss([ Autoprefixer({ browsers: ['last 2 versions', 'ie 8', 'ie 9', 'ie 10'] }) ])
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
