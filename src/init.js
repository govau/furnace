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
import { Log }        from './helper';
import { Settings }   from './settings';
import { HandlePost } from './prepare';
import { Fetch }      from './fetch';


// Check if the user is in verbose mode
if( process.argv.includes('-v') || process.argv.includes('--verbose') ) {
	Log.verboseMode = true;
}

Fetch( Settings.get().uikit.jsonLocation )
	.catch( error => Log.error( error ) )
	.then( uikitJson => {

		// Set the uikit.json to the Settings object
		const newSettings = Settings.get();
		newSettings.uikit.json = uikitJson;
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
				Log.welcome( `Furnace is ready to melt GOLD on port ${ Settings.get().server.port }` );
			});
	})
