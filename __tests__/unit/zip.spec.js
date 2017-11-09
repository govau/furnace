/***************************************************************************************************************************************************************
 *
 * Zip.js unit tests
 *
 * @file src/zip.js
 *
 * Tested methods:
 * - AddFile
 * - AddGlob
 *
 **************************************************************************************************************************************************************/

import Archiver from 'archiver';

import { AddFile, AddGlob } from '../../src/zip';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// AddFile
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('AddFile: should not return any errors when adding a file', () => {
	console.error = jest.fn();

	let zipFile = Archiver(`zip`);

	AddFile( "aaa", 'file.txt', zipFile );
	expect( console.error.mock.calls.length ).toBe( 0 );
});


test('AddFile: should only allow strings in the file', () => {
	console.error = jest.fn();

	let zipFile = Archiver(`zip`);

	AddFile( true, 'file.txt', zipFile);
	expect( console.error.mock.calls.length ).toBe( 1 );
	expect( console.error.mock.calls[0][0] ).toBe( ` 🔥 🔥        \u001B[31mERROR:   AddFile: content (boolean) and archivePath (string) can only be string.\u001b[39m` );
});


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// AddGlob
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('AddGlob: should not error when given three strings', () => {
	console.error = jest.fn();

	let zipFile = Archiver(`zip`);

	AddGlob( '*.js', 'files/', 'files/', zipFile );
	expect( console.error.mock.calls.length ).toBe( 0 );
});


test('AddGlob: should error when given an non string value', () => {
	console.error = jest.fn();

	let zipFile = Archiver(`zip`);

	AddGlob( true, 'files/', 'files/', zipFile );
	expect( console.error.mock.calls.length ).toBe( 1 );
});

