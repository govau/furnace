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

	const files = {
		cssMin: '',
		jsMin: [],
		jsFileName: '',
		framework: '',
		data: [],
	}

	// Change the value to module for the directory lookup
	if ( data.framework.includes( 'js' ) || data.framework.includes( 'jsModules' ) ) {
		files.jsFileName = 'module';
		files.framework = 'js';
	}
	else if ( data.framework.includes( 'jqueryModules' ) ) {
		files.jsFileName = 'jquery';
		files.framework = 'jquery';
	} else {
		files.jsFileName = data.framework[ 0 ];
		files.framework = data.framework[ 0 ];
	}


	data.components.map( component => {

		const sassFile      = `${ SETTINGS.uikit.componentsDir + component }/lib/sass/_module.scss`;
		const cssFile       = `${ SETTINGS.uikit.componentsDir + component }/lib/css/styles.css`;
		const sassDirectory = `${ SETTINGS.uikit.componentsDir + component }/lib/sass/`;
		const jsFile        = `${ SETTINGS.uikit.componentsDir + component }/lib/js/${ files.jsFileName }.js`;

		// Minify CSS
		if( data.buildOptions.includes( 'css' ) && Fs.existsSync( sassFile ) ) {
			files.cssMin = `${ files.cssMin }@import '${ sassFile }';\n`;
		}

		// CSS Modules
		if( data.buildOptions.includes( 'cssModules' ) && Fs.existsSync( cssFile ) ) {
			const css = Fs.readFileSync( cssFile ).toString();
			AddFile( css, `css/${ component }.css`, files.data );
		}

		// Sass Modules
		if( data.buildOptions.includes( 'sassModules' ) && Fs.existsSync( sassDirectory ) ) {
			console.log( sassDirectory );

			AddPath( sassDirectory, `sass/${ component }/`, files.data )

			files.sassModules = `${ files.sassModules }@import 'sass/${ component }/_module.scss';\n`;
		}

		// Jquery/JS minified
		if( data.framework.includes( 'js' ) || data.framework.includes( 'jquery' ) ) {
			if( Fs.existsSync( jsFile ) ) {
				files.jsMin.push( jsFile );
			}
		}

		// React/jQuery/JS modules
		else if ( Fs.existsSync( jsFile ) ) {
			const js = Fs.readFileSync( jsFile ).toString();
			AddFile( js, `${ files.framework }/${ component }.js`, files.data );
		}

	});

	// Add the sass versioning to the start of the minified CSS string
	files.cssMin !== ''
		? files.cssMin = `@import '${ SETTINGS.npm.sassVersioning }';\n\n${ files.cssMin }`
		: '';

	// if ( files.sassDirectories.length ) {
	// 	files.sassDirectories.unshift( SETTINGS.npm.sassVersioning );
	// 	files.sassModules = `@import 'sass/sass-versioning/_index.scss';\n\n${ files.sassModules }`
	// }

	return files;
};


/**
 * Get files - Get the paths based on the framework and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const GetBundles = ( bundles ) => {
	Log.verbose( `Running GetBundles` );

	if( bundles.cssMin ) {
		const cssMin = GetMinCss( bundles.cssMin );
		AddFile( cssMin, 'css/furnace.min.css', bundles.data );
	}

	if( bundles.jsMin.length !== 0 ) {
		const jsMin = GetMinJs( bundles.jsMin );
		AddFile( jsMin, `${ bundles.framework }/furnace.min.js`, bundles.data );
	}

	return bundles.data;

};
