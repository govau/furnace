import Fs from 'fs';
import Path from 'path';

import { SETTINGS } from './settings';
import { Log } from './helper';
import { GetMinCss } from './css';
import { GetMinJs } from './javascript';
import { AddFile, AddGlob } from './zip';

/**
 * Get files - Get the paths based on the framework and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const GetFiles = ( data ) => {
	Log.verbose( `Running GetFiles` );

	console.log( data );

	const bundle = [];
	const jsMin  = [];

	let imports = {
		css: `@import '${ SETTINGS.npm.sassVersioning }';\n\n`,
		sass: `@import 'node_modules/sass-versioning/dist/_index.scss';\n\n`,
	};

	const jsFileName  = SETTINGS.uikit.framework[ data.framework ].fileName;
	const jsDirectory = SETTINGS.uikit.framework[ data.framework ].directory;

	return new Promise ( ( resolve, reject ) => {

		data.components.map( component => {

			const uikitJson = SETTINGS.uikit.json[`${ SETTINGS.uikit.prefix }${ component }`];
			const componentPancake = uikitJson['pancake-module'];
			const dependencies = uikitJson.peerDependencies;

			const sassFile = Path.normalize( `uikit/packages/${ component }/${ componentPancake.sass.path }` );
			const sassDirectory = Path.normalize( sassFile ).replace('_module.scss', '');

			let jsFile;
			if ( componentPancake[ jsDirectory ] ) {
				jsFile = Path.normalize( `uikit/packages/${ component }/${ componentPancake[ jsDirectory ].path }` );
			}

			// Minified JS add directory to array
			if( jsFile && data.framework.includes( 'js' ) ) {
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
			if( data.buildOptions.includes( 'css' ) ) {
				imports.css += `@import '${ sassFile }';\n`;
			}

			// CSS Modules ( Add the files to the zip )
			if( data.buildOptions.includes( 'cssModules' ) && Object.keys( dependencies ).length ) {
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
			if( data.buildOptions.includes( 'sassModules' ) ) {
				imports.sass += `@import 'components/${ component }/sass/_module.scss';\n`;
				bundle.push( AddGlob( `*.scss`, sassDirectory, `components/${ component }/sass/` ) );
			}
		});

		resolve({
			jsMin: jsMin,
			imports: imports,
			bundle: bundle,
			buildOptions: data.buildOptions
		})
	})

};



/**
 * Promise that reads a file
 *
 * @param pathToFile
 */
export const ReadFile = ( pathToFile ) => {
	Log.verbose( `Running ReadFile: ${ pathToFile }` );

	return new Promise( ( resolve, reject ) => {

		Fs.readFile( pathToFile, 'utf8', ( error, fileContents ) => {

			if( error && error.code !== 'EEXIST' ) {
				reject( `File not found: ${ pathToFile }` );
			}

			Log.verbose( `Read: ${ pathToFile }` );
			resolve( fileContents );

		});

	})
}
