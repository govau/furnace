import Fs from 'fs';
import Path from 'path';

import { SETTINGS } from './settings';
import { Log } from './helper';
import { GetMinCss } from './css';
import { GetMinJs } from './javascript';
import { AddFile } from './zip';

/**
 * Get files - Get the paths based on the framework and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const GetFiles = ( data ) => {
	Log.verbose( `Running GetFiles` );

	const bundle       = [];
	const jsMin        = [];
	let   sassIncludes = '';
	const jsFileName   = SETTINGS.uikit.framework[ data.framework ].fileName;
	const jsDirectory  = SETTINGS.uikit.framework[ data.framework ].directory;

	return new Promise ( ( resolve, reject ) => {

		data.components.map( component => {

			const componentPancake = SETTINGS.uikit.json[`${ SETTINGS.uikit.prefix }${ component }`]['pancake-module'];
			const sassFile = Path.normalize( `packages/${ component }/${ componentPancake.sass.path }` );
			const sassDirectory = Path.normalize( sassFile ).replace('_module.scss', '');

			let jsFile;
			if ( componentPancake[ jsDirectory ] ) {
				jsFile = Path.normalize( `packages/${ component }/${ componentPancake[ jsDirectory ].path }` );
			}

			if( jsFile && data.framework.includes( 'js' ) ) {
				jsMin.push( jsFile );
			}

			// Minify CSS ( Create Sass string to be ran with node-sass )
			if( data.buildOptions.includes( 'css' ) ) {
				sassIncludes += `@import '${ sassFile }';\n`;
			}

		});

		resolve({
			jsMin: jsMin,
			sassIncludes: sassIncludes,
			bundle: bundle,
			buildOptions: data.buildOptions,
			jsDirectory: jsDirectory
		})
	})

};


// Promisified Read File
export const ReadFile = ( pathToFile ) => {
	Log.verbose( `Running ReadFile` );

	return new Promise( ( resolve, reject ) => {

		Fs.readFile( pathToFile, 'utf8', ( error, fileContents ) => {

			if( error && error.code !== 'EEXIST' ) {
				Log.verbose( `File not found: ${ pathToFile }` );
				reject( error );
			}
			else {
				Log.verbose( `Read: ${ pathToFile }` );
				resolve( fileContents );
			}

		});

	})
}

	//	// Sass Modules ( Add the paths, create sass file for the zip )
	// 	// if( data.buildOptions.includes( 'sassModules' ) && Fs.existsSync( sassDirectory ) ) {
	// 	// 	AddPath( sassDirectory, `/sass/${ component }/` );
	// 	// }

	// 	// CSS Modules ( Add the files to the zip )
	// 	if( data.buildOptions.includes( 'cssModules' ) ) {
	// 		bundle.push(
	// 			ReadFile( cssFile )
	// 				.then( cssData => {
	// 					AddFile( cssData, `css/${ component }.css` );
	// 				})
	// 				.catch( error => {
	// 					console.error( error );
	// 				})
	// 		);
	// 	}


	// React/jQuery/JS modules ( Add the files to the zip )
	// else if( jsFile ) {
	// 	bundle.push(
	// 		ReadFile( jsFile )
	// 			.then( jsData => {
	// 				AddFile( jsData, `${ jsDirectory }/${ component }.js` );
	// 			})
	// 			.catch( error => {
	// 				console.error( `${ error }\n${ jsFile }` );
	// 			})
	// 	)
	// }
