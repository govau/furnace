/***************************************************************************************************************************************************************
 *
 * Turn sass into css
 *
 * GetMinCss  - Takes sass and returns css that is minified and autoprefixed
 * Sassify    - Promisified node-sass, compile Sass code into CSS
 * Autoprefix - Automatically adds autoprefixes to a css file
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Sass         from 'node-sass';
import Autoprefixer from 'autoprefixer';
import Postcss      from 'postcss';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log }      from './helper';


/**
 * GetMinCss - Takes sass and returns css that is minified and autoprefixed
 *
 * @param  {string} sassString - A string of sass to be turned into css
 *
 * @return {string}            - Resolves minified css from node-sass and autoprefixer.
 */
export const GetMinCss = ( sassString ) => {
	Log.verbose( `Running GetMinCss`);

	return new Promise( ( resolve, reject ) => {
		Sassify( sassString )
			.then( Autoprefix )
			.then( cssMin => resolve( cssMin ) )
			.catch( error => reject( error ) );
	});

}


/**
 * Sassify - Promisified node-sass, compile Sass code into CSS
 *
 * @param  {string} scss - The Sass file to be compiled
 * @param  {string} css  - The location where the CSS should be written to
 *
 * @return {string}     - Minified css as a string
 */
export const Sassify = ( scss ) => {
	Log.verbose( `Running Sassify`);

	return new Promise( ( resolve, reject ) => {

		// Run node-sass with uikit helper.js settings
		Sass.render({
			data: scss,
			indentType: 'tab',
			precision: 8,
			outputStyle: 'compressed',
		}, ( error, result ) => {

			if( result && !error ) {
				resolve( result.css.toString() );
			}
			else {
				error ? reject( error ) : reject();
			}

		})
	});
};


/**
 * Autoprefix - Automatically adds autoprefixes to a css file
 *
 * @param  {string} file - The file to be prefixed
 *
 * @return {string}     - Prefixed css as a string
 */
export const Autoprefix = ( css ) => {
	Log.verbose( `Running Autoprefix`);

	return new Promise ( ( resolve, reject ) => {

		// Run autoprefixer with uikit helper.js settings
		Postcss([ Autoprefixer({ browsers: ['last 2 versions', 'ie 8', 'ie 9', 'ie 10'] }) ])
			.process( css )
			.then( ( prefixed ) => {
				prefixed
					.warnings()
					.forEach( ( warn ) => console.warn( warn.toString() ) );

				resolve( prefixed.css );
			})
			.catch( error => reject( error ) );

	})
};
