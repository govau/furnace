import { SETTINGS } from './settings';
import { Log } from './helper';
import { GetMinCss } from './css';
import { GetMinJs } from './javascript';
import { AddFile } from './zip';

/**
 * Bundler - Get the paths based on the framework and components chosen.
 *
 * @param data - The request.body returned from the form
 */
export const Bundle = ( data ) => {

	const bundle = [];

	// Add the sass versioning to the start of the minified CSS string
	if ( data.buildOptions.includes( 'css' ) ) {
		data.sassIncludes = `@import '${ SETTINGS.npm.sassVersioning }';\n\n` + data.sassIncludes;
		// Add sass versioning
		bundle.push(
			GetMinCss( data.sassIncludes )
				.then( cssMin => {
					AddFile( cssMin, 'css/furnace.min.css', data.files )
				})
		);
	}

	console.log( data.jsMin );

	if( data.jsMin.length !== 0 ) {
		GetMinJs( data.jsMin )
			.then( jsMinData => {
				AddFile( jsMinData, `${ data.jsDirectory }/furnace.min.js`, data.files );
			})
			.catch( error => {
				console.error( error );
			})
	}

	return Promise.all( bundle );
}
