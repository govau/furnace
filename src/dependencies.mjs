
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

	components.map( component => {

		// Add the prefix if it doesn't have it
		component = component.startsWith( prefix )
			? component
			: prefix + component;

		// Don't go deeper for core, we add this after to the start.
		if( component !== `${ prefix }core` ) {

			// Add the component to results without the prefix
			result.push( component.replace( prefix, '' ) );

			// Check that components dependencies
			GetDependencies(
				Object.keys( json[ component ].peerDependencies ),
				result
			)
		}

	});

	return [ ...new Set( result ) ];
};
