/**
 *
 * Bundle the data into a zipFile
 *
 * SETTINGS     - Keeping our settings across multiple imports
 *
 */

import Path from 'path';

import { SETTINGS } from './settings';
import { Log } from './helper';
import { GetMinCss } from './css';
import { GetMinJs } from './javascript';
import { AddFile, AddGlob } from './zip';
import { ReadFile } from './files';


/**
 * Prepare bundle - Get the paths based on the jsOuput, styleOutput and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const PrepareBundle = ( data ) => {
	Log.verbose( `Running PrepareBundle` );

	const bundle = [];
	const jsMin  = [];

	let imports = {
		css: `@import '${ SETTINGS.npm.sassVersioning }';\n\n`,
		sass: `@import 'node_modules/sass-versioning/dist/_index.scss';\n\n`,
	};

	// Get immutable values from our SETTINGS based on the input of the form.
	const jsFileName	= SETTINGS.uikit.jsOutput[ data.jsOutput ].fileName;
	const jsDirectory = SETTINGS.uikit.jsOutput[ data.jsOutput ].directory;
	const jsOutput		= SETTINGS.uikit.jsOutput[ data.jsOutput ].option;
	const styleOutput = SETTINGS.uikit.styleOutput[ data.styleOutput ].option;

	return new Promise ( ( resolve, reject ) => {

		data.components.map( component => {

			const componentJson			= SETTINGS.uikit.json[`${ SETTINGS.uikit.prefix }${ component }`];
			const componentPancake	= componentJson['pancake-module'];
			const dependencies			= componentJson.peerDependencies;

			const sassFile					= Path.normalize( `uikit/packages/${ component }/${ componentJson['pancake-module'].sass.path }` );
			const sassDirectory			= Path.normalize( sassFile ).replace('_module.scss', '');


			let jsFile;
			if( componentPancake[ jsDirectory ] ) {
				jsFile = Path.normalize( `uikit/packages/${ component }/${ componentPancake[ jsDirectory ].path }` );
			}

			// Minified JS add directory to array
			if( jsFile && jsOutput === 'js' ) {
				jsMin.push( jsFile );
			}
			// JS Modules read the file and add it to the zip
			else if( jsFile ) {
				bundle.push(
					ReadFile( jsFile )
						.then( jsData => AddFile( jsData, `components/${ component }/${ jsDirectory }/${ jsFileName }.js` ) )
						.catch( error => reject( error ) )
				);
			}

			// Minify CSS ( Create Sass string to be ran with node-sass )
			if( styleOutput === 'css' ) {
				imports.css += `@import '${ sassFile }';\n`;
			}

			// CSS Modules ( Add the files to the zip )
			if( styleOutput === 'cssModules' && Object.keys( dependencies ).length ) {
				let cssModuleImport = `@import '${ SETTINGS.npm.sassVersioning }';\n\n`;
				Object.keys( dependencies ).map( dependency => {
					cssModuleImport += `@import '${ `uikit/packages/${ dependency.replace('@gov.au/', '') }/${ componentPancake.sass.path }` }';\n`;
				});

				bundle.push(
					GetMinCss( cssModuleImport )
						.then( cssMin => AddFile( cssMin, `${ component }/css/styles.css` ) )
						.catch( error => reject( error ) )
				);
			}

			// Sass Modules ( Add the paths, create sass file for the zip )
			if( styleOutput === 'sassModules' ) {
				imports.sass += `@import 'components/${ component }/sass/_module.scss';\n`;
				bundle.push( AddGlob( `*.scss`, sassDirectory, `components/${ component }/sass/` ) );
			}
		});

		resolve({
			jsMin: jsMin,
			imports: imports,
			bundle: bundle,
			styleOutput: styleOutput
		})
	})

};


/**
 * Bundle - Gets all of the data for the zip files.
 *
 * @param data - The request.body returned from the form
 */
export const Bundle = ( data ) => {
	Log.verbose( `Running Bundle` );

	return new Promise ( ( resolve, reject ) => {

		if ( data.styleOutput === 'css' ) {
			data.bundle.push(
				GetMinCss( data.imports.css )
					.catch( error => reject( error ) )
					.then( cssMin => AddFile( cssMin, 'css/furnace.min.css' ) )
			);
		}

		if ( data.styleOutput === 'sassModules' ) {
			data.bundle.push(
				ReadFile( SETTINGS.npm.sassVersioning )
					.catch( error => reject( error ) )
					.then( sassVersioning => AddFile( sassVersioning, `node_modules/sass-versioning/dist/_index.scss` ) )
			);

			data.bundle.push(
				AddFile( data.imports.sass, 'main.scss' )
			);
		}


		if( data.jsMin.length !== 0 ) {
			data.bundle.push(
				GetMinJs( data.jsMin )
					.catch( error => reject( error ) )
					.then( jsMinData => AddFile( jsMinData, `js/furnace.min.js` ) )
			)
		}


		Promise.all( data.bundle )
			.catch( error => reject( error ) )
			.then( resolve );

	})
}
