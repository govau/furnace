/***************************************************************************************************************************************************************
 *
 * Prepare.js unit tests
 *
 * @file src/prepare.js
 *
 * Tested methods:
 * - HandleData
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { HandleData } from '../../src/prepare';
import { Settings } from '../../src/settings';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// uikit.json injection in Settings
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const uikitJson        = require( './mocks/uikit.json' );
const newSettings      = Settings.get();
newSettings.uikit.json = uikitJson;
Settings.set( newSettings );



// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// HandleData
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('HandleData: takes an object then formats it', () => {

	const data = {
		components: [ 'accordion', '@gov.au/breadcrumbs' ],
		styleOutput: 'css',
		jsOutput: 'js',
	};

	const formattedData = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'css',
		jsOutput: 'js',
	};

	HandleData( data )
		.then( data => expect( data ).toEqual( formattedData ) );

});


test('HandleData: should error with a component that does not exist', () => {
	console.error = jest.fn();

	const data = {
		components: 'oisjdoioioj',
		styleOutput: 'css',
		jsOutput: 'js',
	};

	HandleData( data )
		.then( data => {
			expect( console.error.mock.calls.length ).toBe( 1 );
			expect( console.error.mock.calls[0][0] ).toBe(` 🔥 🔥        \u001B[31mERROR:   Component @gov.au/oisjdoioioj not found.\u001b[39m`);
		});

});


test('HandleData: takes an object then formats it', () => {
	const data = {
		styleOutput: 'css',
		jsOutput: 'js',
	};

	HandleData( data )
		.catch( error => expect( error ).toEqual( 'No components selected' ) );

});
