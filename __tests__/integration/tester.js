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
const Path        = require( 'path' );
const Spawn       = require( 'child_process' );
const Del         = require( 'del' );
const Copydir     = require( 'copy-dir' );
const Fs          = require( 'fs' );
const Dirsum      = require( 'dirsum' );
const Request     = require( 'request' );
const Querystring = require( 'querystring' );
const AdmZip      = require( 'adm-zip' );
const Replace     = require( 'replace-in-file' );



//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// LOCAL
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const { Log } = require( '../../dist/helper' );


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
	Log.verbose( `Verbose mode activated`);
}


let PASS = true;
const zipName = `AU-DesignSystem`;

const allComponents = [
	'core',
	'_test-01',
	'_test-02',
	'_test-03',
	'_test-04',
	'_test-05',
];

// Core and JavascriptOnly
const testJS = [ 'core', '_test-02' ];

// Dependencies and MoreDependencies
const testDependencies = [ '_test-01', '_test-03' ];

const TESTS = [
	// {
	// 	name: 'Test1: Some components minfied css/js',
	// 	folder: 'test-01',
	// 	post: {
	// 		components: testDependencies,
	// 		styleOutput: 'css',
	// 		jsOutput: 'js',
	// 	},
	// 	compare: `${ zipName }/`,
	// 	empty: false,
	// },
	// {
	// 	name: 'Test2: All components css/js modules',
	// 	folder: 'test-02',
	// 	post: {
	// 		components: allComponents,
	// 		styleOutput: 'cssModules',
	// 		jsOutput: 'jsModules',
	// 	},
	// 	compare: `${ zipName }/`,
	// 	empty: false,
	// },
	// {
	// 	name: 'Test3: Some components sass/react modules',
	// 	folder: 'test-03',
	// 	post: {
	// 		components: testDependencies,
	// 		styleOutput: 'sassModules',
	// 		jsOutput: 'react',
	// 	},
	// 	compare: `${ zipName }/`,
	// 	empty: false,
	// },
	// {
	// 	name: 'Test4: All components minfied css/js',
	// 	folder: 'test-04',
	// 	post: {
	// 		components: allComponents,
	// 		styleOutput: 'css',
	// 		jsOutput: 'js',
	// 	},
	// 	compare: `${ zipName }/`,
	// 	empty: false,
	// },
	// {
	// 	name: 'Test5: Core only minfied css/js',
	// 	folder: 'test-05',
	// 	post: {
	// 		components: [ 'core' ],
	// 		styleOutput: 'css',
	// 		jsOutput: 'js',
	// 	},
	// 	compare: `${ zipName }/`,
	// 	empty: false,
	// },
	{
		name: 'Test6: Core with a module without css',
		folder: 'test-06',
		post: {
			components: [ testJS ],
			styleOutput: 'css',
			jsOutput: 'js',
		},
		compare: `${ zipName }/`,
		empty: false,
	},
];


const Tester = ( ( tests ) => {
	Log.info( 'Running tests' );

	Furnace( 'start' )
		.then( ( furnaceId ) =>  {
			const allTasks = [];

			tests.map( test => {

				allTasks.push(
					Test( test )
				);
			});

			// Addded all tests to the promise array
			Promise.all( allTasks )
				.catch( error => {
					Log.error(`An error occurred: ${ Path.basename( error ) }`);
					Furnace( 'exit', furnaceId );
					process.exit( 1 );
				})
				.then( () => {
					// Run the test one more time to check for memory leaks
					Test( tests[ 0 ] )
						.then( () => {
							Furnace( 'exit', furnaceId );

							if( PASS ) {
								Log.done(`😅  All tests have passed`);

								process.exit( 0 );
							}
							else {
								Log.done(`😳  Ouch! Some tests failed`);

								process.exit( 1 );
							}
						})
						.catch( error => {
							Log.error( error );
							process.exit( 1 );
					});
			});

		})
		.catch( error => {
			Log.error( `Nooooooooo: ${ error }` );
			process.exit( 1 );
		});

});


/**
 * Test - Run a single test
 *
 * @param {object} test             - A single object containing the tests
 * @param {object}.name             - The name of the test
 * @param {object}.folder           - The folder the test is in
 * @param {object}.post             - The post object that contains mock post data
 * @param {object}.post.components  - The components to create a zip from
 * @param {object}.post.styleOutput - The style output to create a zip from
 * @param {object}.post.jsOutput    - The js output to create a zip from
 * @param {object}.compare          - The name of the fixture folder to compare against
 * @param {object}.empty            - Check if the folder is supposed to be empty
 *
 * @return {promise object}
 */
const Test = ( test ) => {
	Log.verbose(`Running test`);

	const scriptFolder = Path.normalize( `${ __dirname }/${ test.folder }` );

	return new Promise( ( resolve, reject ) => {

		Delete( scriptFolder )
			.then( ()      => CopyFixtures( scriptFolder, test ) )    // copy fixtures
			.then( ()      => ReplaceFixture( scriptFolder, test ) )  // Adds extra bits in the fixture
			.then( ()      => RequestZip( scriptFolder, test ) )      // now get zip and open it
			.then( ()      => UnZip( scriptFolder, test ) )			  	  // open the zip files
			.then( ()      => Fixture( scriptFolder, test ) )         // get hash for fixture
			.then( result  => Result( scriptFolder, test, result ) )  // get hash for result of test
			.then( result  => Compare( test, result ) )               // now compare both and detail errors
			.then( success => {                                       // cleaning up after ourself
				if( success ) {
					Delete( scriptFolder )
						.then( resolve )
						.catch( error => reject( error ) );
				}
				else {
					resolve();
				}
			})
			.catch( error  => reject( error ) );
	})
}


/**
 * Starting and ending the furnaceProcess
 *
 * @param  {string} action         - The action that the furnace is about to partake in
 * @param  {object} furnaceProcess - The process that is being created or running
 *
 * @return {Promise object}
 */
const Furnace = ( action, furnaceProcess = {} ) => {
	Log.verbose( `${ action } running for furnace` );

	return new Promise ( ( resolve, reject ) => {
		if( action === 'start' ) {

			// `npm run start` in base directory
			const command = Spawn.spawn(
				'npm',
				[ 'run', 'integration-test:start' ],
				{
					cwd: Path.normalize( `${ __dirname }/../../` )
				}
			);

			// Piping console log in when needed
			command.stdout.on('data', ( data ) => {
				console.log( data.toString() );
			});

			// Logging errors found in furnace
			command.stderr.on('data', ( data ) => {
				reject( data.toString() );
			});

			// Check that the furnace is running, resolve the current process
			command.stdout.on('data', ( data ) => {
				if( data.toString().indexOf( 'Furnace is ready to melt GOLD' ) > -1 ) {
					resolve( command );
				}
			})

		}
		else {
			furnaceProcess.kill();
			furnaceProcess.on( 'close', ( code, signal ) => {
				resolve();
			});
		}
	})
}


/**
 * Deleting files from previous tests
 *
 * @param  {string} path     - The path to the folder that needs cleaning
 *
 * @return {Promise object}
 */
const Delete = ( path ) => {
	Log.verbose( 'Deleting files from previous tests' );

	const trash = [
		Path.normalize(`${ path }/fixture/**/.DS_Store`),
		Path.normalize(`${ path }/${ zipName }.zip`),
		Path.normalize(`${ path }/${ zipName }/`),
		Path.normalize(`${ path }/_fixture/`),
	];

	return new Promise( ( resolve, reject ) => {
		Del( trash )
			.catch( error => {
				reject( error );
			})
			.then( paths => {
				Log.verbose( `Cleaned: ${ path }`);

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
	Log.verbose( 'Copying fixtures' );

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
 * Replace placeholders in temp fixtures
 *
 * @param  {string} path     - The path to the folder that needs cleaning
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}
 */
const ReplaceFixture = ( path, settings ) => {
	return new Promise( ( resolve, reject ) => {
		if( settings.empty ) {
			resolve();
		}
		else {
			const uikitJson = require( Path.normalize( '../integration/mocks/uikit.json' ) );

			Replace({
					files: [
						Path.normalize(`${ path }/_fixture/**`),
					],
					from: [
						/\[v-core\]/g,
					],
					to: [
						uikitJson[ "@gov.au/core" ].version,
					],
					allowEmptyPaths: true,
					encoding: 'utf8',
				})
				.catch( error => {
					reject( error );
				})
				.then( changedFiles => {
					resolve();
			});
		}
	});
};


/**
 * Mock a request to the furnace (express server) and get a zip file
 *
 * @param  {string} path     - The path to the shell script
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}
 */
const RequestZip = ( path, settings ) => {
	Log.verbose( 'Requesting a zip from the furnace' );

	return new Promise( ( resolve, reject ) => {

		Request.post({
			url: 'http://localhost:8080/furnace/',
			form: Querystring.stringify( settings.post ),
			encoding: 'binary',
			headers: {
				'User-Agent': 'stress-tester',
			},
		},
		( error, response, body ) => {
			if( !error && response.statusCode === 200 ) {
				Log.verbose( 'Got a huge, hot nugget from Furnace' );

				Fs.writeFile( `${ path }/${ zipName }.zip`, body, 'binary', ( error ) => {
					if( error ) {
						Log.error( 'Unable to save zip file' );
						reject( error );
					}
					else {
						Log.verbose( `Tossing the zip recklessly into: ${ settings.folder }/${ zipName }.zip` );
						resolve();
					}
				})
			}
			else {
				Log.verbose( 'There was an issue finding the furnace, maybe try a torch?' );
				error ? reject( error ) : reject();
			}
		})

	});
};


/**
 * Unzip the file
 *
 * @param  {string} path     - The path to the shell script
 *
 * @return {Promise object}
 */
const UnZip = ( path, settings ) => {
	Log.verbose( 'unZip the file' );

	return new Promise ( ( resolve, reject ) => {

		Log.verbose( `Cracking open the nugget: ${ settings.folder }/${ zipName }.zip -> ${ settings.folder }/${ zipName }/`);

		try {
			const zip = new AdmZip( `${ path }/${ zipName }.zip` );
			zip.extractAllTo( `${ path }/${ zipName }/`, true );

			Log.verbose( `Nugget cracked open and revealed: ${ settings.folder }/${ zipName }/`);
			resolve();
		}
		catch( error ) {
			reject( error );
		}


	})
}


/**
 * Get the checksum hash for the fixture of a test
 *
 * @param  {string} path     - The path to the test folder
 * @param  {object} settings - The settings object for this test
 *
 * @return {Promise object}  - The hash object of all files inside the fixture
 */
const Fixture = ( path, settings ) => {
	Log.verbose( 'Get the hash for the fixture of a test' );

	return new Promise( ( resolve, reject ) => {
		if( !settings.empty ) {
			Dirsum.digest( Path.normalize(`${ path }/_fixture/${ settings.compare }/`), 'sha256', ( error, hashes ) => {
				if( error ) {
					Log.error( error );

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
	Log.verbose( 'Get the hash for the result of the test' );

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
					Log.error(`${ settings.name } failed becasue it produced files but really shoudn’t`);

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
	Log.verbose( 'Comparing the output of a test against its fixture' );

	return new Promise( ( resolve, reject ) => {
		if( hashes.fixture.hash === hashes.result.hash ) {
			Log.done(`${ settings.name } passed`); // yay

			resolve( true );
		}
		else { // grr
			PASS = false;
			Log.error(`${ settings.name } failed`);

			// flatten hash object
			const fixture = hashes.fixture.files;
			const result = hashes.result.files;

			// iterate over fixture
			for( const file of Object.keys( fixture ) ) {
				const compare = result[ file ]; // get the hash from our result folder
				delete result[ file ];          // remove this one so we can keep track of the ones that were not inside the fixture folder

				if( compare === undefined ) {  // we couldn’t find this file inside the resulting folder
					Log.error(`Missing ${ file } file inside result folder`);
				}
				else {
					const fileName = file.split('/');

					if( fixture[ file ] !== compare && fileName[ fileName.length - 1 ] !== 'hash' ) { // we don’t want to compare folders
						Log.error(`Difference inside ${ settings.folder} ${ file } file`);
					}
				}
			}

			if( Object.keys( result ).length > 0 ) { // found files that have not been deleted yet
				let files = [];

				for( const file of Object.keys( result ) ) {
					files.push( file ); // make ’em readable
				}

				Log.error(`Some new files not accounted for: ${ files.join(', ') } inside the fixture folder`);
			}

			resolve( false );
		}
	});
};

Tester( TESTS );
