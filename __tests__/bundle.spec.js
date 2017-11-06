/**
 * bundle.js unit tests
 */

import Path from 'path';

import { Bundle } from '../src/bundle';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Bundle
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Bundle: gets all of the data for the zip files.', () => {

	const data = {
		jsMin: [
			Path.normalize( '__tests__/mocks/js/mock1.js' ),
			Path.normalize( '__tests__/mocks/js/mock2.js' ),
		],
		imports: {
			css: `@import '__tests__/mocks/scss/mock1.scss';\n@import '__tests__/mocks/scss/mock2.scss';`
		},
		bundle: [],
		buildOptions: [ 'css' ]
	};

	Bundle( data )
		.then( data => expect( data ).toEqual( undefined ) );

});

test('Bundle: gets all of the data for the zip files with sass.', () => {

		const data = {
			jsMin: [],
			imports: {
				sass: `@import '__tests__/mocks/scss/mock1.scss';\n@import '__tests__/mocks/scss/mock2.scss';`
			},
			bundle: [],
			buildOptions: [ 'sassModules' ]
		};

		Bundle( data )
			.then( data => expect( data ).toEqual( [ undefined, undefined ] ) );

	});


test('Bundle: invalid css.', () => {

	const data = {
		jsMin: [],
		imports: {
			css: `@impo__tests__/mocksscss/mock2.scss';`
		},
		bundle: [],
		buildOptions: [ 'css' ]
	};

	Bundle( data )
		.catch( error => expect( error.message ).toBe( `Invalid CSS after \"...scss/mock2.scss\": expected 1 selector or at-rule, was \"';\"` ));
});
