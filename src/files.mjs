import Fs from 'fs';

import { SETTINGS } from './settings';
import { Log } from './helper';
import { GetMinCss } from './css';
import { GetMinJs } from './javascript';
import { AddFile, AddPath } from './zip';

/**
 * Get files - Get the paths based on the framework and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const GetFiles = ( data ) => {
	Log.verbose( `Running GetFiles` );

	const files = [];
	let jsMin = []; // This should be const
	let sassCssMin = '';
	let jsFileName = '';
	let framework = '';

	let sassModule = '';

	// Change the value to module for the directory lookup
	// Create an SETTINGS.files.js: 'module'
	// Align the SETTINGS.* with the value from the form
	if ( data.framework.includes( 'js' ) || data.framework.includes( 'jsModules' ) ) {
		jsFileName = 'module';
		framework = 'js';
	}
	else if ( data.framework.includes( 'jqueryModules' ) ) {
		jsFileName = 'jquery';
		framework = 'jquery';
	}
	else {
		jsFileName = data.framework[ 0 ];
		framework = data.framework[ 0 ];
	}


	data.components.map( component => {

		const sassFile      = `${ SETTINGS.uikit.componentsDir + component }/lib/sass/_module.scss`;
		const cssFile       = `${ SETTINGS.uikit.componentsDir + component }/lib/css/styles.css`;
		const sassDirectory = `${ SETTINGS.uikit.componentsDir + component }/lib/sass/`;
		const jsFile        = `${ SETTINGS.uikit.componentsDir + component }/lib/js/${ jsFileName }.js`;

		// Minify CSS ( Create Sass string to be ran with node-sass )
		if( data.buildOptions.includes( 'css' ) && Fs.existsSync( sassFile ) ) {
			sassCssMin = `${ sassCssMin }@import '${ sassFile }';\n`;
		}

		// Jquery/JS minified ( Create array of files to be iterated upon and concatenated/uglified )
		if( data.framework.includes( 'js' ) || data.framework.includes( 'jquery' ) ) {
			if( Fs.existsSync( jsFile ) ) {
				jsMin.push( jsFile );
			}
		}
		// React/jQuery/JS modules ( Add the files to the zip )
		else if ( Fs.existsSync( jsFile ) ) {
			const js = Fs.readFileSync( jsFile ).toString();
			AddFile( js, `${ framework }/${ component }.js`, files );
		}

		// CSS Modules ( Add the files to the zip )
		if( data.buildOptions.includes( 'cssModules' ) && Fs.existsSync( cssFile ) ) {
			const css = Fs.readFileSync( cssFile ).toString();
			AddFile( css, `css/${ component }.css`, files );
		}

		// Sass Modules ( Add the paths, create sass file for the zip )
		if( data.buildOptions.includes( 'sassModules' ) && Fs.existsSync( sassDirectory ) ) {
			AddPath( sassDirectory, `/sass/${ component }/`, files );
			sassModule = `${ sassModule }@import 'sass/${ component }/_module.scss';\n`;
		}

		// Create a package.json file for the sass modules...
		// In the pancake object copy settings from form input
		// Align sassModule with sassCssMin so we have one sass import string
		// Align the directories with the uikit e.g. packages/component/lib/

	});


	// This is the bundler code....

	const bundler = [];

	// Add the sass versioning to the start of the minified CSS string
	if ( sassCssMin ) {
		// Add sass versioning
		sassCssMin = `@import '${ SETTINGS.npm.sassVersioning }';\n\n${ sassCssMin }`;

		bundler.push( GetMinCss( sassCssMin ) );



		// promises.push( functionWhichIsPromise )
		// Promise.all( promises )
		//	.then( resolve( ) );


		// AddFile( cssMin, 'css/furnace.min.css', files );
	}

	if( jsMin.length !== 0 ) {
		jsMin = GetMinJs( jsMin );
		AddFile( jsMin, `${ framework }/furnace.min.js`, files );
	}

	// Add the sass versioning to the start of the file...
	if ( sassModule !== '' ) {
		sassModule = `@import 'node_modules/sass-versioning/_index.scss';\n\n${ sassModule }`;
		AddFile( sassModule, `sass/main.scss`, files );
	}



	return files;
};

