import { SETTINGS } from './settings';
import { Log } from './helper';
import { GetMinCss } from './css';
import { GetMinJs } from './javascript';
import { AddFile } from './zip';
import { ReadFile } from './files';

/**
 * Bundler - Gets all of the data for the zip files.
 *
 * @param data - The request.body returned from the form
 */
export const Bundle = ( data ) => {
	Log.verbose( `Running Bundle` );

	return new Promise ( ( resolve, reject ) => {

		if ( data.buildOptions.includes( 'css' ) ) {
			data.bundle.push(
				GetMinCss( data.imports.css )
					.then( cssMin => AddFile( cssMin, 'css/furnace.min.css' ) )
					.catch( error => reject( error ) )
			);
		}

		if ( data.buildOptions.includes( 'sassModules' ) ) {
			data.bundle.push(
				ReadFile( SETTINGS.npm.sassVersioning )
					.then( sassVersioning => AddFile( sassVersioning, `node_modules/sass-versioning/dist/_index.scss` ) )
					.catch( error => reject( error ) )
			);

			data.bundle.push(
				AddFile( data.imports.sass, 'main.scss' )
			);
		}


		if( data.jsMin.length !== 0 ) {
			data.bundle.push(
				GetMinJs( data.jsMin )
					.then( jsMinData => AddFile( jsMinData, `js/furnace.min.js` ) )
					.catch( error => reject( error ) )
			)
		}


		Promise.all( data.bundle )
			.then( resolve )
			.catch( error => reject( error ) );

	})
}
