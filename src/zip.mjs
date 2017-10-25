/**
 *
 * Use archiver to create zip archives from files, folders and paths.
 *
 * AddFile - Add a string of content to a file to be placed into a zip
 * CompileZip - Compile all of files and paths into one zipe
 *
 */

// Dependencies
import Archiver from 'archiver';

// Local dependencies
import { Log } from './helper';

'use strict';

/**
 *
 * AddFile, adds a file and returns it as a string
 *
 * @param {string} content - The string of content to go into the file
 * @param {string} archivePath - Create a file for the string to go into
 *
 * @return {array} files - The array of files
 */
export const AddFile = ( content, archivePath, files ) => {
	Log.verbose(`Zip: Adding file: ${archivePath}`);

	if( typeof content !== `string` ) {
		Log.error(`Zip: Adding file: Content can only be string, is ${typeof content}`);
	}
	else {
		if( content.length > 0 ) {
			files.push({
				content: content,
				name: `/GOLD-furnace/${ archivePath }`,
			});
		}
	}

	return files;
};


export const AddPath =  ( path, archivePath, files ) => {
	Log.verbose(`Adding path: ${ path }`);

	if( typeof path !== `string` ) {
		Log.error(`Adding path: Path can only be string, is ${ typeof path }`);
	}
	else {
		if( path.length > 0 ) {
			files.push(
				Archiver(`zip`).file( path, { name: `/GOLD-furnace${ archivePath }` } )
			);
		}
	}

	return files;
}




/**
 *
 * CompileZip - Turn the files array into a zip file using archiver
 *
 * @param archive - The response containing the archiver head
 * @param files - The files array to be iterated upon to go into the zip file
 *
 */
export const CompileZip = ( archive, files ) => {
	Log.verbose(`Zip: Compiling zip`);

	files.map( file => {
		archive.append( file.content, { name: file.name } );
	});

	try {
		archive.finalize(); //send to server
		Log.info(`Zip sent!`);
	}
	catch( error ) {
		Log.error(`Zip ERROR`);
		Log.error( error );
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
export const GetZip = ( files, response ) => {

	response.writeHead(200, {
		'Content-Type': `application/zip`,
		'Content-disposition': `attachment; filename=Nugget.zip`,
	});

	zipFile.pipe( response );

	CompileZip( zipFile, data.files );

	Log.done(`Job's done!`);

};



// addBulk: ( cwd, files, archivePath ) => {
// 	Log.verbose(`Zip: Adding bluk: ${cwd}${files} to: ${archivePath}`);

// 	if(typeof files !== `object`) {
// 		Log.error(`Zip: Adding files: Path can only be array/object, is ${typeof files}`);
// 	}
// 	else {

// 		Zip.archive.bulk({ //add them all to the archive
// 			expand: true,
// 			cwd: cwd,
// 			src: files,
// 			dest: `/GOLD-furnace${archivePath}`,
// 			filter: `isFile`,
// 		});

// 	}
// },




// },
