/***************************************************************************************************************************************************************
 *
 * Dependencies.js unit tests
 *
 * @file src/dependencies.js
 *
 * Tested methods:
 * - GetDependencies
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { GetDependencies } from '../../src/dependencies';
import { Settings } from '../../src/settings';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// uikit.json injection in Settings
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const uikitJson        = require( './mocks/uikit.json' );
const newSettings      = Settings.get();
newSettings.uikit.json = uikitJson;
Settings.set( newSettings );


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// GetDependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test( 'GetDependencies: gets dependencies of components passed in', () => {

	const componentsBefore = [ 'accordion', '@gov.au/breadcrumbs' ];
	const componentsAfter = [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ];

	expect( GetDependencies( componentsBefore ) ).toEqual( componentsAfter );

});


test( 'GetDependencies: should fail as there is no component called `oisjdoioioj`', () => {
	console.error = jest.fn();

	const componentsBefore = [ 'oisjdoioioj' ]

	GetDependencies( componentsBefore );

	expect( console.error.mock.calls.length ).toBe( 1 );
	expect( console.error.mock.calls[0][0] ).toBe(` 🔥 🔥        \u001B[31mERROR:   Component @gov.au/oisjdoioioj not found in uikit.json\u001b[39m`);

});


test( 'GetDependencies: should always return core', () => {
	const componentsBefore = [];
	expect( GetDependencies( componentsBefore ) ).toEqual( [ 'core' ] );

});
