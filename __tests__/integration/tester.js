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
const Del         = require( 'del' );
const Copydir     = require( 'copy-dir' );
const Fs          = require( 'fs' );
const Dirsum      = require( 'dirsum' );
const Request     = require( 'request' );
const Querystring = require( 'querystring' );
const AdmZip      = require( 'adm-zip' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// LOCAL
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const { Log } = require( '../../dist/helper' );


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
	Log.verbose( `--- YOLO mode activated, messages will contain references and bad jokes ---`);
}


let PASS = true;
const zipName = `GOLD-AU`;

const allComponents = [
	'core',
	'animate',
	'accordion',
	'body',
	'link-list',
	'breadcrumbs',
	'buttons',
	'callout',
	'control-input',
	'cta-link',
	'direction-links',
	'footer',
	'grid-12',
	'header',
	'headings',
	'inpage-nav',
	'keyword-list',
	'page-alerts',
	'progress-indicator',
	'responsive-media',
	'select',
	'skip-link',
	'tags',
	'text-inputs'
];

// Accordion is complex, breadcrumbs has lots of dependencies
const someComponents = [ 'accordion', 'breadcrumbs' ];

const TESTS = [
	{
		name: 'Test1: Some components minfied css/js',
		folder: 'test-01',
		post: {
			components: someComponents,
			styleOutput: 'css',
			jsOutput: 'js',
		},
		compare: `${ zipName }/`,
		empty: false,
	},
	{
		name: 'Test2: All components css/js modules',
		folder: 'test-02',
		post: {
			components: allComponents,
			styleOutput: 'cssModules',
			jsOutput: 'jsModules',
		},
		compare: `${ zipName }/`,
		empty: false,
	},
	{
		name: 'Test3: Some components sass/react modules',
		folder: 'test-03',
		post: {
			components: someComponents,
			styleOutput: 'sassModules',
			jsOutput: 'react',
		},
		compare: `${ zipName }/`,
		empty: false,
	},
	{
		name: 'Test4: All components minfied css/js',
		folder: 'test-04',
		post: {
			components: allComponents,
			styleOutput: 'css',
			jsOutput: 'js',
		},
		compare: `${ zipName }/`,
		empty: false,
	},
];


const Tester = ( ( tests ) => {
	Log.info( 'Running tests' );

	const allTasks = [];

	tests.map( test => {

		const scriptFolder = Path.normalize( `${ __dirname }/${ test.folder }` );

		allTasks.push(
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
						return Delete( scriptFolder );
					}
					else {
						return Promise.resolve();
					}
				})
				.catch( error  => Log.error( `Noooooo: ${ error }` ) )
		);
	})

	// finished with all tests
	Promise.all( allTasks )
		.catch( error => {
			Log.error(`An error occurred: ${ Path.basename( error ) }`);

			process.exit( 1 );
		})
		.then( () => {
			if( PASS ) {
				Log.done(`😅  All tests have passed`);

				process.exit( 0 );
			}
			else {
				Log.done(`😳  Ouch! Some tests failed`);

				process.exit( 1 );
			}
	});
});


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
			// maybe in the future we have dynamic paths that depend on the system they are tested on.

			// Replace({
			// 		files: [
			// 			Path.normalize(`${ path }/_fixture/**`),
			// 		],
			// 		from: [
			// 			/\[thing\]/g,
			// 		],
			// 		to: [
			// 			'thing',
			// 		],
			// 		allowEmptyPaths: true,
			// 		encoding: 'utf8',
			// 	})
			// 	.catch( error => {
			// 		reject( error );
			// 	})
			// 	.then( changedFiles => {
					resolve();
			// });
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
