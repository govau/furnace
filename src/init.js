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


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log }         from './helper';
import { SettingsGet } from './settings';
import { HandlePost }  from './prepare';


// Check if the user is in verbose mode
if(process.argv.includes('-v') || process.argv.includes('--verbose')) {
	Log.verboseMode = true;
}


/**
 * Server - Collect POST data and run HandlePost function on it
 */
export const Server = Express();

Server
	// Middleware to use the querystring library
	.use( BodyParser.urlencoded( { extended: false } ) )

	// On post to the server run the HandlePost function
	.post( SettingsGet().server.root, HandlePost )

	// When a user gets on the express server, redirect them
	.get( "*", ( request, response ) => {
		response.redirect( 301, SettingsGet().server.redirect );
	})

	// Start the express server
	.listen( SettingsGet().server.port, ( request, response ) => {
		Log.welcome( `Furnace is ready to melt GOLD on port ${ SettingsGet().server.port }` );
	});
