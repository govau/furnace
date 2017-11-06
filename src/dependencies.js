
'use strict';

import { Log } from './helper';
import { SETTINGS } from './settings';


/**
 * Gets an array of all components with the depenedencies.
 *
 * @param  components {array}  - Components to look for dependencies on
 * @param  result     {array}  - Array where we populate the dependencies, optional, default: [ 'core' ]
 * @param  json       {object} - Object that contains the uikit depedencies
 * @param  prefix     {string} - Prefix before the component used in the dependency lookup
 *
 * @return            {array} - The components and dependencies found
 */
export const GetDependencies = (
	components,
	result = [ 'core' ],
	json = SETTINGS.uikit.json,
	prefix = SETTINGS.uikit.prefix
) => {
	Log.verbose( `Running GetDependencies`);

	return new Promise( ( resolve, reject ) => {

		components.map( component => {

			// Add the prefix if it doesn't have it
			component = component.startsWith( prefix )
			? component
			: prefix + component;

			if ( json[ component ] !== undefined ) {

				// Add the dependencies first
				Object.keys( json[ component ].peerDependencies ).map( dependency => {
					result.push( dependency.replace( prefix, '' ) );
				});

				// Add the component after the dependencies
				result.push( component.replace( prefix, '' ) );

			} else {
				reject( `Component ${ component } not found.`);
			}

		});

		// Only return unique values
		resolve( [ ...new Set( result ) ] );

	})
};
