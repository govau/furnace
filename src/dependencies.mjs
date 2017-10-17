
'use strict';

import Fs from 'fs';

import { Log } from './helper';



/**
 * Generate a dependency representation of a module inside an object by calling this function repeatedly
 *
 * @param  {string} name - The name of the module
 *
 * @return {object}      - An object of the dependency tree
 */
export const GetDepTree = ( name, dependencies ) => {
	Log.verbose( `Running GetDepTree`);
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


/**
 * GetComponents - Gets the components with dependencies.
 *
 * @param uikitJson - The file where the dependencies live
 */
export const GetDependencies = ( uikit, components ) => {
	Log.verbose( `Running GetComponents`);

	// Get the arrays of dependencies for each component
	const dependencies = components.map( component => {
		const componentDependencies = GetDepTree( `@gov.au/${ component }`, uikit );
		return [ ...new Set( Flatten( componentDependencies ) ) ];
	});

	// Flatten and find unique dependencies and components
	components = [ [].concat.apply([], dependencies) , components ];
	return [ 'core', ...new Set( [].concat( ...components ) ) ];

}


/**
 * Flatten a deep object into a one level array
 *
 * @param  {object} object - The object to be flattened
 *
 * @return {array}         - The resulting flat array
 */
export const Flatten = object => {
	Log.verbose( `Running Flatten`);
	return [].concat( ...Object.keys( object ).map( key =>
		Object.keys( object[ key ] ).length > 0
			? [ key, ...Flatten( object[ key ] ) ]
			: key
		)
	);
};
