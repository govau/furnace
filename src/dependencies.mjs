
'use strict';

import { Log } from './helper';
import { SETTINGS } from './settings';


/**
 * GetComponents - Gets an array of all components with the depenedencies.
 *
 * @param components - The components to look for dependencies on.
 * @return result - The components and dependencies found.
 */
export const GetDependencies = ( components, result = [] ) => {
	Log.verbose( `Running GetDependencies`);

	components.map( component => {

		// Add the prefix if it doesn't have it
		component = component.startsWith( SETTINGS.uikit.prefix )
			? component
			: SETTINGS.uikit.prefix + component;

		// Don't go deeper for core, we add this after to the start.
		if( component !== `${ SETTINGS.uikit.prefix }core` ) {

			// Add the component to results without the prefix
			result.push( component.replace( SETTINGS.uikit.prefix, '' ) );

			// Check that components dependencies
			GetDependencies(
				Object.keys( SETTINGS.uikit.json[ component ].peerDependencies ),
				result
			)
		}

	});

	return result;

}
