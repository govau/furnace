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
	Log.verbose( `Running Bundle` );

	new Promise ( ( resolve, reject ) => {

		if ( data.buildOptions.includes( 'css' ) ) {
			const sassIncludes = `@import '${ SETTINGS.npm.sassVersioning }';\n\n` + data.sassIncludes;

			data.bundle.push(
				GetMinCss( sassIncludes )
					.then( cssMin => AddFile( cssMin, 'css/furnace.min.css' ) )
					.catch( error => reject( error ) )
			);
		}

		if( data.jsMin.length !== 0 ) {
			data.bundle.push(
				GetMinJs( data.jsMin )
					.then( jsMinData => AddFile( jsMinData, `${ data.jsDirectory }/furnace.min.js` ) )
					.catch( error => reject( error ) )
			)
		}


		const bundle = Promise.all( data.bundle )
			.catch( error => reject( error ));

		resolve( bundle );

	})
}
