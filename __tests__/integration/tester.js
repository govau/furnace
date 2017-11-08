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
const Querystring = require('querystring');


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// LOCAL
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
const { Log } = require( '../../dist/helper' );


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


let PASS = true;

const TESTS = [
	{
		name: 'Test1: testing minified css, minified js and dependency fetching.',
		folder: 'zip-01',
		post: {
			components: [ 'accordion', 'breadcrumbs' ],
			styleOutput: 'css',
			jsOutput: 'js',
		},
		compare: 'GOLD-AU/',
		empty: false,
	},
	{
		name: 'Test2: testing css modules, js modules and dependency fetching.',
		folder: 'zip-02',
		post: {
			components: [ 'accordion', 'breadcrumbs' ],
			styleOutput: 'cssModules',
			jsOutput: 'jsModules',
		},
		compare: 'GOLD-AU/',
		empty: false,
	},
	{
		name: 'Test3: testing sass modules, react and dependency fetching.',
		folder: 'zip-03',
		post: {
			components: [ 'accordion', 'breadcrumbs' ],
			styleOutput: 'sassModules',
			jsOutput: 'react',
		},
		compare: 'GOLD-AU/',
		empty: false,
	},
	{
		name: 'Test4: testing all modules with minified css and minified js.',
		folder: 'zip-04',
		post: {
			components: [
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
			],
			styleOutput: 'css',
			jsOutput: 'js',
		},
		compare: 'GOLD-AU/',
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
				.catch( error  => Log.error( `Noooooo: ${ error }` ) )
				.then( ()      => CopyFixtures( scriptFolder, test ) )    // copy fixtures
				.then( ()      => Run( test ) )                           // now run script
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

	// finished with all tests
	Promise.all( allTasks )
		.catch( error => {
			Log.error(`An error occurred: ${ Path.basename( error ) }`);

			process.exit( 1 );
		})
		.then( () => {
			if( SETTINGS.PASS ) {
				Log.finished(`😅  All tests have passed`);

				process.exit( 0 );
			}
			else {
				Log.finished(`😳  Ouch! Some tests failed`);

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
const Run = ( settings ) => {
	Log.verbose( 'Rrrrunrunrun' );

	return new Promise( ( resolve, reject ) => {

		Request.post({
			url: 'http://localhost:8080/furnace/',
			form: Querystring.stringify( settings.post ),
			encoding: 'binary',
			headers: {
				'User-Agent': 'stress-tester',
			},
		}, ( error, response, body ) => {
			if( error ) {
				reject( error );
			}
			else {
				resolve( body );
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
					Log.fail(`${ settings.name } failed becasue it produced files but really shoudn’t`);

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
			Log.pass(`${ settings.name } passed`); // yay

			resolve( true );
		}
		else { // grr
			PASS = false;
			Log.fail(`${ settings.name } failed`);

			// flatten hash object
			const fixture = Flatten( hashes.fixture.files );
			const result = Flatten( hashes.result.files );

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
						Log.error(`Difference inside ${ settings.folder + file } file`);
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
