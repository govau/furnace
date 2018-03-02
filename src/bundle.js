/***************************************************************************************************************************************************************
 *
 * Bundle the data into a zipFile
 *
 * Bundle - Iterates over the components, bundles tasks together and adds file to zip.
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path     from 'path';
import Archiver from 'archiver';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log }              from './helper';
import { GetMinCss }        from './css';
import { GetMinJs }         from './javascript';
import { AddFile, AddGlob } from './zip';
import { ReadFile }         from './files';
import { Settings }         from './settings';
import { GetDependencies }  from './dependencies';


/**
 * Bundle - Iterates over the components, bundles tasks together and adds file to zip
 *
 * @param  {object} data    - The request.body and it's dependencies formatted from the POST
 *
 * @return {object} zipFile - The zipFile which will be sent back to the user
 */
export const Bundle = ( data ) => {
	Log.verbose( `Running Bundle` );

	// Get the components dependencies
	const components = GetDependencies( data.components );

	// A new instance of the zipFile
	let zipFile = Archiver(`zip`);

	// An array of promises that adds files and globs to the zip.
	const bundle = [];

	// Sass @imports for minification and sassModules
	let cssImports  = '';
	let sassImports = '';
	const sassVersioning = `@import '${ Settings.get().npm.sassVersioning }';\n\n`;

	// JS values based on the form input
	const jsDirectory = Settings.get().uikit.jsOutput[ data.jsOutput ].directory;
	const jsMin = [];

	// We clone the default so we can make changes
	const packageJson = JSON.parse( JSON.stringify( Settings.get().packageJson ) );

	return new Promise( ( resolve, reject ) => {

		// Iterate through components and dependencies
		components.map( component => {

			// The uikit.json object for the current component
			const componentJson = Settings.get().uikit.json[`${ Settings.get().uikit.prefix }${ component }`];

			packageJson.dependencies[ `${ Settings.get().uikit.prefix }${ component }` ] = componentJson.version;

			// If the current component has javascript
			if( componentJson['settings'][ jsDirectory ] ) {
				const jsFile = Path.normalize( `${ Settings.get().uikit.componentLocation }/${ component }/${ componentJson[ 'settings' ][ jsDirectory ].path }` );

				// minifyJs was selected in the form, add the directory to the array
				if( data.jsOutput === 'js' ) {
					jsMin.push( jsFile );
				}

				// minfyJs not selected in the form, add JS modules based on the fileName/Directory
				if( data.jsOutput === 'react' ) {
					bundle.push(
						ReadFile( Path.normalize( jsFile ) )
							.then( jsData => AddFile( jsData, `/${ Settings.get().packageJson.pancake.react.location }${ component }.js`, zipFile ) )
					);
				}

				// jsModules selected in the form, add JS modules based on the fileName/Directory
				if( data.jsOutput === 'jsModules' ) {
					bundle.push(
						GetMinJs( [ Path.normalize( jsFile ) ] )
							.then( jsData => AddFile( jsData, `/${ Settings.get().packageJson.pancake.js.location }/${ component }.js`, zipFile ) )
					);
				}
			}


			// minifyCss was selected, create an @Import string
			const sassFile = Path.normalize( `${ Settings.get().uikit.componentLocation }/${ component }/${ componentJson[ 'settings' ].sass.path }` );
			if( data.styleOutput === 'css' && componentJson[ 'settings' ].sass.path && component !== 'core' ) {
				cssImports += `@import '${ sassFile }';\n`;
			}


			// If cssModules was selected
			const dependencies = componentJson.dependencies;
			if( data.styleOutput === 'cssModules' && Object.keys( dependencies ).length && componentJson[ 'settings' ].sass.path ) {

				// Create an @import string for CSS modules, add sassVersioning first.
				let cssModuleImport = `@import '${ Settings.get().npm.sassVersioning }';\n\n`;

				// Add an @import for each dependency
				Object.keys( dependencies ).map( dependency => {
					let dependencyJson = Settings.get().uikit.json[ dependency ];

					if( dependencyJson[ 'settings' ].sass.path ){
						cssModuleImport += `@import '` +
						`${ `${ Settings.get().uikit.componentLocation }/${ dependency.replace('@gov.au/', '') }/${ componentJson[ 'settings' ].sass.path }` }';\n`;
					}
				});

				// Add an @import for the current component
				cssModuleImport += `@import '${ `${ Settings.get().uikit.componentLocation }/${ component }/${ componentJson[ 'settings' ].sass.path }` }';\n`;

				// Compile the CSS and add the file to the Zip
				bundle.push(
					GetMinCss( cssModuleImport )
						.then( cssMin => AddFile( cssMin, `/css/${ component }.css`, zipFile ) )
				);
			}


			// sassModules was selected, create an @import for the zipFile, addGlob to zip
			if( data.styleOutput === 'sassModules' ) {
				const sassDirectory = Path.normalize( sassFile ).replace('_module.scss', '');
				sassImports += `@import 'node_modules/@gov.au/${ component }/lib/sass/_module.scss';\n`;
				bundle.push( AddGlob( `*.scss`, sassDirectory, `node_modules/@gov.au/${ component }/lib/sass/`, zipFile ) );
			}
		});
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// ^Iteration end
// -------------------------------------------------------------------------------------------------------------------------------------------------------------

		// minifyCss was selected, turn cssImports into a minified css file
		if( data.styleOutput === 'css' && cssImports !== '' ) {
			const coreSass = `@import "${ Path.normalize( Settings.get().uikit.componentLocation + '/core/lib/sass/_module.scss' ) }";\n`;
			cssImports = sassVersioning + coreSass + cssImports;

			packageJson.pancake.css.minified = true;

			bundle.push(
				GetMinCss( cssImports )
					.then( cssMin => AddFile( cssMin, `${ Settings.get().packageJson.pancake.css.location }${ Settings.get().packageJson.pancake.css.name }`, zipFile ) )
			);
		}


		if( data.styleOutput === 'cssModules' ){
			packageJson.pancake.css.modules = true;
		}


		// sassModules was selected, create the main.scss and add sass-versioning
		if( data.styleOutput === 'sassModules' ) {
			sassImports = sassVersioning + sassImports;
			packageJson.pancake.sass.modules = true;
			bundle.push(
				ReadFile( Settings.get().npm.sassVersioning )
					.then( sassVersioning => AddFile( sassVersioning, `node_modules/sass-versioning/dist/_index.scss`, zipFile ) )
			);

			bundle.push(
				AddFile( sassImports, Settings.get().packageJson.pancake.sass.name, zipFile )
			);
		}


		// jsMin was selected, create a minified js file
		if( jsMin.length !== 0 ) {
			packageJson.pancake.js.minified = true;
			bundle.push(
				GetMinJs( jsMin )
					.then( jsMinData =>
						AddFile( jsMinData, `${ Settings.get().packageJson.pancake.js.location }${ Settings.get().packageJson.pancake.js.name }`, zipFile )
					)
			)
		}

		if( data.jsOutput === 'jsModules' ) {
			packageJson.pancake.js.modules = true;
		}


		// Run all of the promises
		Promise.all( bundle )
			.then( () => {
				AddFile( JSON.stringify( packageJson, null, '\t' ), `package.json`, zipFile )
			})
			.then( () => resolve( zipFile ) )
			.catch( error => reject( error ) );

	})
};

