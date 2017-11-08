/**
 *
 * File system functions
 *
 * ReadFile - Promise that reads a file.
 *
 */

import Fs from 'fs';

import { Log } from './helper';

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
			else {
				Log.verbose( `Read: ${ pathToFile }` );
				resolve( fileContents );
			}

		});
	})
}
