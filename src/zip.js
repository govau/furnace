/***************************************************************************************************************************************************************
 *
 * Zip files, globs and return them as a response
 *
 * AddFile    - Add a string of content to a file to be placed into a zip
 * AddGlob    - Adds a file and returns it as a string
 * GetZip     - Send the zip back to the user in the response.writeHead
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Archiver from 'archiver';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log } from './helper';


// Create a new empty zip on first run
let zipFile = Archiver(`zip`);


/**
 *
 * AddFile - Adds a file and returns it as a string
 *
 * @param {string} content     - The string of content to go into the file
 * @param {string} archivePath - The location of the files in the zip
 */
export const AddFile = ( content, archivePath ) => {
	Log.verbose(`AddFile: ${ archivePath }`);

	if( typeof content !== `string` || typeof archivePath !== `string` ) {
		Log.error( `AddFile: content (${ typeof content }) and archivePath (${ typeof archivePath }) can only be string.` );
	}
	else {
		zipFile.append( content, { name: archivePath } );
	}
};


/**
 * AddGlob - Adds a file and returns it as a string
 *
 * @param {string} pattern     - The glob to match files and add to the zip
 * @param {string} directory   - The directory for the glob to be applied to
 * @param {string} archivePath - The location of the files in the zip
 */
export const AddGlob = ( pattern, directory, archivePath ) => {
	Log.verbose(`AddGlob: ${ directory + pattern }`);

	if( typeof pattern !== `string` || typeof directory !== `string` || typeof archivePath !== `string` ) {
		Log.error( `AddGlob: pattern (${ typeof pattern }), directory (${ typeof directory }) and archivePath (${ typeof archivePath }) can only be string.` );
	}
	else {
		zipFile.glob( pattern, { cwd: directory }, { prefix: archivePath } );
	}
};


/**
 * GetZip - Send the zip back to the user in the response.writeHead
 *
 * @param response - The response containing the archiver head
 */
export const GetZip = ( response ) => {
	Log.verbose( `GetZip: Compiling zip` );

	response.writeHead(200, {
		'Content-Type': `application/zip`,
		'Content-disposition': `attachment; filename=GOLD-AU.zip`,
	});

	zipFile.pipe( response );

	try {
		zipFile.finalize();
		Log.done( `Job's done: Alright alright alright!` );
	}
	catch( error ) {
		Log.error( error );
	}

	zipFile = Archiver( `zip` );
};
