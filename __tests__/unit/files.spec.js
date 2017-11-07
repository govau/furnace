/**
 * files.js unit tests
 */

import Path from 'path';

import { ReadFile } from '../src/files';

// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// ReadFile
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Readfile: should return a string value from a file', () => {

	const file = Path.normalize( '__tests__/mocks/js/mock1.js' );

	ReadFile( file )
		.then( data => expect( data ).toBe( `console.log( ' aaaaa ' );\n` ) );
});


test('Readfile: should return an error when file does not exist', () => {

	const file = Path.normalize( 'iaojdijoijoi.js' );

	ReadFile( file )
		.catch( error => expect( error ).toBe( `File not found: iaojdijoijoi.js` ) );
});

test('Readfile: should reject when file cannot be opened', () => {

	const file = Path.normalize( '__tests__/mocks/readfile/abc.txt' );

	ReadFile( file )
		.catch( error => expect( error ).toBe( `Cannot be read/write/edited` ) );
});
