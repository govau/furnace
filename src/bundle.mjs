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

	return new Promise ( ( resolve, reject ) => {

		if ( data.buildOptions.includes( 'css' ) ) {
			data.bundle.push(
				GetMinCss( cssIncludes )
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


		Promise.all( data.bundle )
			.then( resolve )
			.catch( error => reject( error ) );

	})
}
