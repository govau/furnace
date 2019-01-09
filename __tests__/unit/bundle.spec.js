/***************************************************************************************************************************************************************
 *
 * Bundle.js unit tests
 *
 * @file src/bundle.js
 *
 * Tested methods:
 * - Bundle
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Bundle } from '../../src/bundle';
import { Settings } from '../../src/settings';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// design-system-components.json injection in Settings
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
const agdsJson        = require( './mocks/design-system-components.json' );
const newSettings      = Settings.get();
newSettings.design-system-components.json = agdsJson;
Settings.set( newSettings );


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Bundle
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Bundle: css minified and jsminified.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'css',
		jsOutput: 'js',
	};

	return Bundle( data )
		.then( data => expect( data._entriesCount ).toEqual( 3 ) );

});

test('Bundle: sassModules and react modules.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'sassModules',
		jsOutput: 'react',
	};

	return Bundle( data )
		.then( data => expect( data._entriesCount ).toEqual( 21 ) );

});


test('Bundle: cssModules and jsModules with dependencies.', () => {

	const data = {
		components: [ 'accordion', 'breadcrumbs' ],
		styleOutput: 'cssModules',
		jsOutput: 'jsModules',
	};

	return Bundle( data )
		.then( data => expect( data._entriesCount ).toEqual( 6 ) );

});
