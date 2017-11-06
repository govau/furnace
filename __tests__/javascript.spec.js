/**
 * javascript.js unit tests
 */


import { GetMinJs } from '../src/javascript';

// ----------------------------------------------------------------
// GetMinJs
// ----------------------------------------------------------------
test('GetMinJs: should minify and concat multiple js files', () => {
	const jsFiles = [
		'__tests__/mocks/js/mock1.js',
		'__tests__/mocks/js/mock2.js'
	];

	GetMinJs( jsFiles )
		.then( js => expect( js ).toBe( `console.log(\" aaaaa \"),body.window.js();` ) );

});


test('GetMinJs: should error when given an empty array', () => {
	const jsFiles = [];

	GetMinJs( jsFiles )
		.catch( error => expect( error ).toBe( `The jsFiles must have atleast one file` ) );

});

test('GetMinJs: should error when a file does not exist', () => {
	const jsFiles = [
		'ioiojoijoi.js'
	];

	GetMinJs( jsFiles )
		.catch( error => expect( error.code ).toBe( `ENOENT` ) );

});
