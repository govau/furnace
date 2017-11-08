/***************************************************************************************************************************************************************
 *
 * TESTER
 *
 * Running end to end tests
 *
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEPENDENCIES
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const Path    = require( 'path' );
const Del     = require( 'del' );
const Copydir = require( 'copy-dir' );
const Fs      = require( 'fs' );
const Dirsum  = require( 'dirsum' );
const Spawn   = require( 'child_process' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// LOCAL
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const TESTS   = require( './tests' );
const { Log } = require( '../../dist/helper' );


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


let PASS = true;


const Tester = ( ( tests ) => {
	Log.info( 'Running tests' );

	const allTasks = [];

	tests.map( test => {

		const scriptFolder = Path.normalize( `${ __dirname }/${ test.folder }` );

		allTasks.push(
			Delete( scriptFolder )
				.catch( error  => Log.error( `Noooooo: ${ error }` ) )
				.then( ()      => CopyFixtures( scriptFolder, test ) )    // copy fixtures
				.then( ()      => Run( scriptFolder, test ) )             // now run script
				.then( ()      => Fixture( scriptFolder, test ) )         // get hash for fixture
				.then( result  => Result( scriptFolder, test, result ) )  // get hash for result of test
				.then( result  => Compare( test, result ) )               // now compare both and detail errors
				.then( success => {                                       // cleaning up after ourself
					if( success ) {
						return Delete( scriptFolder );
					}
					else {
						return Promise.resolve();
					}
				})
		);
	})

});


/**
 * Deleting files from previous tests
 *
 * @param  {string} path     - The path to the folder that needs cleaning
 *
 * @return {Promise object}
 */
const Delete = ( path ) => {
	Log.verbose( 'Running delete' );

	const trash = [
		Path.normalize(`${ path }/site`),
		Path.normalize(`${ path }/docs`),
		Path.normalize(`${ path }/testfolder/`),
		Path.normalize(`${ path }/*.log.*`),
		Path.normalize(`${ path }/assets/**/.DS_Store`),
		Path.normalize(`${ path }/fixture/**/.DS_Store`),
		Path.normalize(`${ path }/_fixture/`),
	];

	return new Promise( ( resolve, reject ) => {
		Del( trash )
			.catch( error => {
				reject( error );
			})
			.then( paths => {
				Log.verbose( `Cleaned ${ path } folder`);

				resolve();
		});
	});
};


/**
 * Copy fixture files into a temp folder for later processing
 *
 * @param  {string} path     - The path to the folder that needs cleaning
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}
 */
const CopyFixtures = ( path, settings ) => {
	Log.verbose( 'Running CopyFixtures' );

	return new Promise( ( resolve, reject ) => {
		if( settings.empty ) {
			resolve();
		}
		else {
			Copydir( Path.normalize(`${ path }/fixture/`) , Path.normalize(`${ path }/_fixture/`), error => {
				if( error ) {
					reject( error );
				}
				else {
					resolve();
				}
			});
		}
	});
};


/**
 * Running shell script
 *
 * @param  {string} path     - The path to the shell script
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}
 */
const Run = ( path, settings ) => {
	Log.verbose( 'Running Run runrunrun' );

	return new Promise( ( resolve, reject ) => {
		let errors = '';

		// what the command would look like:
		// console.log('node', [ Path.normalize(`${ path }/../../dist/index.js`), ...settings.script.options ].join(' '));
		// console.log(`in ${ path }`);

		const command = Spawn
			.spawn( 'node', [ Path.normalize(`${ path }/../../dist/index.js`), ...settings.script.options ], {
				cwd: path,
			}
		);

		command.stdout.on('data', ( data ) => {
			// console.log( data.toString() );
		})

		command.stderr.on('data', ( data ) => {
			errors += data.toString();
		})

		command.on( 'close', ( code ) => {
			if( code === 0 ) {
				// Log.pass(`Ran test in ${ Chalk.bgWhite.black(` ${ Path.basename( path ) } `) } folder`);

				resolve();
			}
			else {
				PASS = false;

				reject(`Script errored out with:\n${ Chalk.bold( errors ) }`);
			}
		});
	});
};


/**
 * Get the checksum hash for the fixture of a test
 *
 * @param  {string} path     - The path to the test folder
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}  - The hash object of all files inside the fixture
 */
const Fixture = ( path, settings ) => {
	Log.verbose( 'Running Fixture' );

	return new Promise( ( resolve, reject ) => {
		if( !settings.empty ) {
			Dirsum.digest( Path.normalize(`${ path }/_fixture/${ settings.compare }/`), 'sha256', ( error, hashes ) => {
				if( error ) {
					Log.pass( error );

					PASS = false;

					reject( error );
				}
				else {
					resolve( hashes );
				}
			});
		}
		else {
			resolve({});
		}
	});
};


/**
 * Get the checksum hash for the result of the test
 *
 * @param  {string} path     - The path to the test folder
 * @param  {object} settings - The settings object for this test
 * @param  {object} fixture  - The hash results of the fixture to be passed on
 *
 * @return {Promise object}  - The hash object of all files inside the resulting files
 */
const Result = ( path, settings, fixture ) => {
	Log.verbose( 'Running Result' );

	const location = Path.normalize(`${ path }/${ settings.compare }/`);

	return new Promise( ( resolve, reject ) => {
		if( !settings.empty ) {
			Dirsum.digest( location, 'sha256', ( error, hashes ) => {
				if( error ) {
					Log.error( error );

					PASS = false;

					reject();
				}
				else {

					resolve({ // passing it to compare later
						fixture,
						result: hashes,
					});

				}
			});
		}
		else {
			Fs.access( location, Fs.constants.R_OK, error => {

				if( !error || error.code !== 'ENOENT' ) {
					Log.fail(`${ Chalk.bgWhite.black(` ${ settings.name } `) } failed becasue it produced files but really shoudn’t`);

					PASS = false;

					resolve({
						fixture: {
							hash: 'xx',
							files: {
								location: 'nope',
							},
						},
						result: {
							hash: 'xxx',
							files: {
								location: 'nope',
							},
						},
					});

				}
				else {

					resolve({
						fixture: {
							hash: 'xxx',
						},
						result: {
							hash: 'xxx',
						},
					});

				}
			});
		}
	});
};


/**
 * Compare the output of a test against its fixture
 *
 * @param  {object} settings - The settings object for this test
 * @param  {object} result   - The hash results of fixture and result
 *
 * @return {Promise object}  - The hash object of all files inside the fixture
 */
const Compare = ( settings, hashes ) => {
	Log.verbose( 'Running Compare' );

	return new Promise( ( resolve, reject ) => {
		if( hashes.fixture.hash === hashes.result.hash ) {
			Log.pass(`${ Chalk.bgWhite.black(` ${ settings.name } `) } passed`); // yay

			resolve( true );
		}
		else { // grr
			PASS = false;
			Log.fail(`${ Chalk.bgWhite.black(` ${ settings.name } `) } failed`);

			// flatten hash object
			const fixture = Flatten( hashes.fixture.files );
			const result = Flatten( hashes.result.files );

			// iterate over fixture
			for( const file of Object.keys( fixture ) ) {
				const compare = result[ file ]; // get the hash from our result folder
				delete result[ file ];          // remove this one so we can keep track of the ones that were not inside the fixture folder

				if( compare === undefined ) {  // we couldn’t find this file inside the resulting folder
					Log.error(`Missing ${ Chalk.yellow( file ) } file inside result folder`);
				}
				else {
					const fileName = file.split('/');

					if( fixture[ file ] !== compare && fileName[ fileName.length - 1 ] !== 'hash' ) { // we don’t want to compare folders
						Log.error(`Difference inside ${ Chalk.yellow( settings.folder + file ) } file`);
					}
				}
			}

			if( Object.keys( result ).length > 0 ) { // found files that have not been deleted yet
				let files = [];

				for( const file of Object.keys( result ) ) {
					files.push( file ); // make ’em readable
				}

				Log.error(`Some new files not accounted for: ${ Chalk.yellow( files.join(', ') ) } inside the fixture folder`);
			}

			resolve( false );
		}
	});
};


Tester( TESTS );
