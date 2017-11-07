/**
 *
 * Use archiver to create zip archives from files, folders and paths.
 *
 * AddFile - Add a string of content to a file to be placed into a zip
 * CompileZip - Compile all of files and paths into one zipe
 *
 */

'use strict';

// Dependencies
import Archiver from 'archiver';

// Local dependencies
import { Log } from './helper';


let zipFile = Archiver(`zip`);


/**
 *
 * AddFile, adds a file and returns it as a string
 *
 * @param {string} content - The string of content to go into the file
 * @param {string} archivePath - Create a file for the string to go into
 *
 * @return {array} files - The array of files
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
 *
 * AddGlob - adds a file and returns it as a string
 *
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
 *
 * CompileZip - Turn the files array into a zip file using archiver
 *
 * @param archive - The response containing the archiver head
 * @param files - The files array to be iterated upon to go into the zip file
 *
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
