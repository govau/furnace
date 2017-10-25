/**
 *
 * Export shared helper code
 *
 * Style - Returning ansi escape color codes
 * Log - A logging method
 *
 */

'use strict';

// Dependencies
import Notifier from 'node-notifier';
import Path from 'path';


/**
 * Returning ansi escape color codes
 * Credit to: https://github.com/chalk/ansi-styles
 *
 * @type {Object}
 */
export const Style = {

	/**
	 * Parse ansi code while making sure we can nest colors
	 *
	 * @param  {string} text  - The text to be enclosed with an ansi escape string
	 * @param  {string} start - The color start code, defaults to the standard color reset code 39m
	 * @param  {string} end   - The color end code
	 *
	 * @return {string}       - The escaped text
	 */
	parse: ( text, start, end = `39m` ) => {
		if( text !== undefined ) {
			const replace = new RegExp( `\\u001b\\[${ end }`, 'g' ); // find any resets so we can nest styles

			return `\u001B[${ start }${ text.toString().replace( replace, `\u001B[${ start }` ) }\u001b[${ end }`;
		}
		else {
			return ``;
		}
	},

	/**
	 * Style a string with ansi escape codes
	 *
	 * @param  {string} text - The string to be wrapped
	 *
	 * @return {string}      - The string with opening and closing ansi escape color codes
	 */
	black: text => Style.parse( text, `30m` ),
	red: text => Style.parse( text, `31m` ),
	green: text => Style.parse( text, `32m` ),
	yellow: text => Style.parse( text, `33m` ),
	blue: text => Style.parse( text, `34m` ),
	magenta: text => Style.parse( text, `35m` ),
	cyan: text => Style.parse( text, `36m` ),
	white: text => Style.parse( text, `37m` ),
	gray: text => Style.parse( text, `90m` ),
	bold: text => Style.parse( text, `1m`, `22m` ),

};


/**
 * A logging object for logging prettiness
 *
 * @type {Object}
 */
export const Log = {
	verboseMode: false, // verbose flag

	/**
	 * Log a welcome message
	 *
	 * @param  {string} text - The text you want to log
	 */
	welcome: ( text ) => {
		console.log(` 🔥🔥🔥        ${ Style.bold(`${ text }`) }`);
	},

	/**
	 * Log an error
	 *
	 * @param  {string} text - The text you want to log with the error
	 */
	error: ( text ) => {
		console.error(` 🔥 🔥        ${ Style.red(`ERROR:   ${ text }`) }`);
	},

	/**
	 * Log a message
	 *
	 * @param  {string}  text - The text you want to log
	 */
	info: ( text ) => {
		console.info(` 🔔 🔥        INFO:    ${ text }`);
	},

	/**
	 * Log success
	 *
	 * @param  {string}  text - The text you want to log
	 */
	ok: ( text ) => {
		console.info(` ✔ 🔥        ${ Style.green(`OK:`) }      ${ Style.green( text ) }`);
	},

	/**
	 * Log the final message
	 *
	 * @param  {string}  text - The text you want to log
	 */
	done: ( text ) => {
		console.info(` 🚀 🔥        ${ Style.green( Style.bold( text ) ) }`);
	},

	/**
	 * Log a verbose message
	 *
	 * @param  {string}  text - The text you want to log
	 */
	verbose: ( text ) => {
		if( Log.verboseMode ) {
			console.info(` 🙊 🔥        ${ Style.gray(`VERBOSE: ${ text }`) }`);
		}
	},

	/**
	 * Add some space to the output
	 */
	space: () => {
		console.log(`\n`);
	},
};
