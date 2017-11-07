/**
 * javascript.js unit tests
 */

import Path from 'path';

import { GetMinJs } from '../../src/javascript';

// ----------------------------------------------------------------
// GetMinJs
// ----------------------------------------------------------------
test('GetMinJs: should minify and concat multiple js files', () => {
	const jsFiles = [
		Path.normalize( '__tests__/unit/mocks/js/mock1.js' ),
		Path.normalize( '__tests__/unit/mocks/js/mock2.js' ),
	];

	GetMinJs( jsFiles )
		.then( js => expect( js ).toBe( `console.log(\" aaaaa \"),body.window.js();` ) );

});


test('GetMinJs: should error when given an empty array', () => {
	const jsFiles = [];

	GetMinJs( jsFiles )
		.catch( error => expect( error ).toBe( `The jsFiles must have at least one file` ) );

});

test('GetMinJs: should error when has invalid js', () => {
	const jsFiles = [
		Path.normalize( '__tests__/unit/mocks/js/mock3.js' ),
	];

	return GetMinJs( jsFiles )
		.catch( error =>  expect( error.message ).toBe( `Unexpected token punc «;», expected punc «,»` ) );

});
