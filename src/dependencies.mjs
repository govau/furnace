
'use strict';

import Fs from 'fs';

/**
 * Generate a dependency representation of a module inside an object by calling this function repeatedly
 *
 * @param  {string} name - The name of the module
 *
 * @return {object}      - An object of the dependency tree
 */
export const GetDepTree = ( name, dependencies ) => {
	let tree = {};
	let currentDependencies = Object.keys( dependencies[ name ].peerDependencies );

	// Check that there are dependencies
	if( currentDependencies.length > 0  ) {
		currentDependencies.map( module => {
			// Ignore if it's core, we add this at the start anyway...
			if( module !== '@gov.au/core' ){
				tree[ module.substring( 8 ) ] = GetDepTree( module, dependencies );
			}
		})
	}

	return tree;
};
