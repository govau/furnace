/***************************************************************************************************************************************************************
 *
 * Bundle the data into a zipFile
 *
 * PrepareBundle - Get the paths based on the jsOuput, styleOutput and components chosen.
 * Bundle        - Gets all of the data for the zip files.
 *
 **************************************************************************************************************************************************************/

'use strict';

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { SETTINGS } from './settings';
import { Log } from './helper';
import { GetMinCss } from './css';
import { GetMinJs } from './javascript';
import { AddFile, AddGlob } from './zip';
import { ReadFile } from './files';


/**
 * PrepareBundle - Get the paths and add files to zip
 *
 * @param  { object } data    - The request.body and it's dependencies formatted from the POST.
 *
 * @return { Promise object } - Resolves once all bundles are moved into zipFile
 */
export const PrepareBundle = ( data ) => {
	Log.verbose( `Running PrepareBundle` );

	// An array of promises that adds files and globs to the zip.
	const bundle      = [];

	// Sass @imports for minification and sassModules.
	let cssImports    = `@import '${ SETTINGS.npm.sassVersioning }';\n\n`;
	let sassImports   = `@import 'node_modules/sass-versioning/dist/_index.scss';\n\n`;

	// JS values based on the form input
	const jsFileName  = SETTINGS.uikit.jsOutput[ data.jsOutput ].fileName;
	const jsDirectory = SETTINGS.uikit.jsOutput[ data.jsOutput ].directory;

	// Array of JS files to be uglified
	const jsMin       = [];

	return new Promise ( ( resolve, reject ) => {

		data.components.map( component => {

			// The uikit.json object for the current component
			const componentJson = SETTINGS.uikit.json[`${ SETTINGS.uikit.prefix }${ component }`];


			// If the component has javascript
			if( componentJson['pancake-module'][ jsDirectory ] ) {
				const jsFile = Path.normalize( `uikit/packages/${ component }/${ componentJson['pancake-module'][ jsDirectory ].path }` );

				// If the jsOutput says to minifyJS
				if( data.jsOutput === 'js' ) {
					jsMin.push( jsFile );
				}

				// JS Modules read the file and add it to the zip
				else {
					bundle.push(
						ReadFile( Path.normalize( jsFile ) )
							.then( jsData => AddFile( jsData, `${ component }/js/${ jsFileName }.js` ) )
					);
				}
			}


			// Minify CSS ( Create Sass string to be ran with node-sass )
			const sassFile = Path.normalize( `uikit/packages/${ component }/${ componentJson['pancake-module'].sass.path }` );
			if( data.styleOutput === 'css' ) {
				cssImports += `@import '${ sassFile }';\n`;
			}

			// CSS Modules ( Add the files to the zip )
			const dependencies = componentJson.peerDependencies;
			if( data.styleOutput === 'cssModules' && Object.keys( dependencies ).length ) {
				let cssModuleImport = `@import '${ SETTINGS.npm.sassVersioning }';\n\n`;
				Object.keys( dependencies ).map( dependency => {
					cssModuleImport += `@import '${ `uikit/packages/${ dependency.replace('@gov.au/', '') }/${ componentJson['pancake-module'].sass.path }` }';\n`;
				});

				bundle.push(
					GetMinCss( cssModuleImport )
						.then( cssMin => AddFile( cssMin, `${ component }/css/styles.css` ) )
				);
			}

			// Sass Modules ( Add the paths, create sass file for the zip )
			const sassDirectory = Path.normalize( sassFile ).replace('_module.scss', '');
			if( data.styleOutput === 'sassModules' ) {
				sassImports += `@import '${ component }/sass/_module.scss';\n`;
				bundle.push( AddGlob( `*.scss`, sassDirectory, `${ component }/sass/` ) );
			}
		});

		Promise.all( bundle )
			.catch( error => reject ( error ) )
			.then( () => {
				resolve({
					jsMin: jsMin,
					sassImports: sassImports,
					cssImports: cssImports,
					styleOutput: data.styleOutput
				})
			});
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

		const bundle = [];

		if ( data.styleOutput === 'css' ) {
			bundle.push(
				GetMinCss( data.cssImports )
					.then( cssMin => AddFile( cssMin, 'css/furnace.min.css' ) )
			);
		}

		if ( data.styleOutput === 'sassModules' ) {
			bundle.push(
				ReadFile( SETTINGS.npm.sassVersioning )
					.then( sassVersioning => AddFile( sassVersioning, `node_modules/sass-versioning/dist/_index.scss` ) )
			);

			bundle.push(
				AddFile( data.sassImports, 'main.scss' )
			);
		}


		if( data.jsMin.length !== 0 ) {
			bundle.push(
				GetMinJs( data.jsMin )
					.then( jsMinData => AddFile( jsMinData, `js/furnace.min.js` ) )
			)
		}


		Promise.all( bundle )
			.catch( error => reject( error ) )
			.then( resolve );

	})
}
