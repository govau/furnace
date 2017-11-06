/**
 * prepare.js unit tests
 */

import { HandleData } from '../src/prepare';

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// HandleData
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('HandleData: takes an object then formats it', () => {

	const data = {
		components: [ 'accordion', 'buttons' ],
		buildOptions: 'css',
		framework: 'js',
	};

	const formattedData = {
		components: [ 'core', 'animate', 'accordion', 'buttons' ],
		buildOptions: [ 'css' ],
		framework: [ 'js' ],
	};

	HandleData( data )
		.then( data => expect( data ).toEqual( formattedData ) );

});

test('HandleData: should error with a component that does not exist', () => {

	const data = {
		components: 'oisjdoioioj',
		buildOptions: 'css',
		framework: 'js',
	};

	HandleData( data )
		.then( data => expect( data ).toEqual( formattedData ) )
		.catch( error => console.log( error ) );

});


test('HandleData: takes an object then formats it', () => {

	const data = {
		buildOptions: 'css',
		framework: 'js',
	};

	HandleData( data )
		.catch( error => expect( error ).toEqual( 'No components selected' ) );

});
