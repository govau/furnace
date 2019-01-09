/***************************************************************************************************************************************************************
 *
 * Initialise the Furnace (express server)
 *
 * Server - Collect POST data and run HandlePost function on it
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Express    from 'express';
import BodyParser from 'body-parser';
import Path       from 'path';
import CFonts     from 'cfonts';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log }        from './helper';
import { Settings }   from './settings';
import { HandlePost } from './prepare';


// Check if the user is in verbose mode
if( process.argv.includes('-v') || process.argv.includes('--verbose') ) {
	Log.verboseMode = true;
}


// Get the design-system-components.json and apply it to the Settings object
let jsonLocation =  '../design-system-components.json';
if( process.argv.includes('-j') || process.argv.includes('--json') ) {
	let index = process.argv.indexOf( '-j' ) ||  process.argv.indexOf( '-json' );
	const tempJsonLocation = process.argv[ index + 1 ];
	if( tempJsonLocation !== undefined ) {
		jsonLocation = tempJsonLocation;
	}
}

const agdsJson = require( Path.normalize( jsonLocation ) );
const newSettings = Settings.get();
newSettings.design-system-components.json = agdsJson;
Settings.set( newSettings );


/**
 * Server - Collect POST data and run HandlePost function on it
 */
const Server = Express();

Server
	// Middleware to use the querystring library
	.use( BodyParser.urlencoded( { extended: false } ) )

	// On post to the server run the HandlePost function
	.post( Settings.get().server.root, HandlePost )

	// When a user gets on the express server, redirect them
	.get( "*", ( request, response ) => {
		response.redirect( 301, Settings.get().server.redirect );
	})

	// Start the express server
	.listen( Settings.get().server.port, ( request, response ) => {
		CFonts.say( '- Furnace -', {
			font: 'chrome',
			align:  'center',
			colors: [ 'red', 'yellow', 'blue' ],
		});
		CFonts.say( `Furnace is ready to melt GOLD on|https://localhost:${ Settings.get().server.port }/furnace`, {
			font:  'console',
			align: 'center',
			colors: [ 'white' ],
		});
	});
