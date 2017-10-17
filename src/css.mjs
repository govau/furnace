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

import { SETTINGS } from './settings';
import { Log } from './helper';
import { AddFile } from './zip';

export const GetCss = ( sassDirectories ) => {
	Log.verbose( `Running GetCSS`);

	let css = "";

	// Add sass versioning to the start
	css = `@import '${ SETTINGS.node_modules.sassVersioning }';\n\n`;

	// Add the directories to the string
	sassDirectories.map( sassDir => {
		css = css + `@import '${ sassDir }_module.scss';\n`;
	});

	// Compile the SASS -> CSS
	let compiledCss = Sass.renderSync({
		data: css,
		indentType: 'tab',
		precision: 8,
		includePaths: [ './lib/sass/' ],
		outputStyle: 'compressed',
	});

	compiledCss =  compiledCss.css.toString();

	return AddFile( compiledCss, 'furnace.min.css', [] );

}
