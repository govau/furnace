/**
 * prepare.js unit tests
 */

import { HandleData } from '../src/prepare';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// HandleData
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('HandleData: takes an object then formats it', () => {

	const data = {
		components: [ 'accordion', 'breadcrumbs' ],
		buildOptions: 'css',
		framework: 'js',
	};

	const formattedData = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		buildOptions: [ 'css' ],
		framework: [ 'js' ],
	};

	HandleData( data )
		.then( data => expect( data ).toEqual( formattedData ) );

});


test('HandleData: should error with a component that does not exist', () => {

	console.error = jest.fn();

	const data = {
		components: 'oisjdoioioj',
		buildOptions: 'css',
		framework: 'js',
	};

	HandleData( data )
		.then( data => {
			expect( console.error.mock.calls.length ).toBe( 1 );
			expect( console.error.mock.calls[0][0] ).toBe(` 🔥 🔥        \u001B[31mERROR:   Component @gov.au/oisjdoioioj not found.\u001b[39m`);
		});

});


test('HandleData: takes an object then formats it', () => {

	const data = {
		buildOptions: 'css',
		framework: 'js',
	};

	HandleData( data )
		.catch( error => expect( error ).toEqual( 'No components selected' ) );

});
