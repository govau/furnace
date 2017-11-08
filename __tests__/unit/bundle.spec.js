/**
 * bundle.js unit tests
 */

import Path from 'path';

import { Bundle } from '../../src/bundle';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Bundle
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Bundle: css minified and jsminified.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'css',
		jsOutput: 'js',
	};

	Bundle( data )
		.then( data => expect( data ).toEqual( [ undefined, undefined ] ) );

});

test('Bundle: sassModules and react modules.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'sassModules',
		jsOutput: 'react',
	};

	Bundle( data )
		.then( data => expect( data ).toEqual( [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ] ) );

});


test('Bundle: cssModules and jsModules with dependencies.', () => {

	const data = {
		components: [ 'accordion', 'breadcrumbs' ],
		styleOutput: 'cssModules',
		jsOutput: 'jsModules',
	};

	Bundle( data )
		.then( data => expect( data ).toEqual( [ undefined, undefined, undefined ] ) );

});
