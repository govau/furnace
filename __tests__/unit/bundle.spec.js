/**
 * bundle.js unit tests
 */

import Path from 'path';

import { PrepareBundle, Bundle } from '../../src/bundle';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// PrepareBundle
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('PrepareBundle: prepares bundle for css and js.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'css',
		jsOutput: 'js',
	};

	const promiseMock = new Promise ( ( resolve, reject ) => {
		resolve();
	});

	const preparedData = {
		cssImports: `@import 'uikit/packages/core/node_modules/sass-versioning/dist/_index.scss';\n
@import 'uikit/packages/core/lib/sass/_module.scss';
@import 'uikit/packages/animate/lib/sass/_module.scss';
@import 'uikit/packages/accordion/lib/sass/_module.scss';
@import 'uikit/packages/link-list/lib/sass/_module.scss';
@import 'uikit/packages/body/lib/sass/_module.scss';
@import 'uikit/packages/breadcrumbs/lib/sass/_module.scss';\n`,
		jsMin: [
			"uikit/packages/animate/lib/js/module.js",
			"uikit/packages/accordion/lib/js/module.js"
		],
		sassImports: `@import 'node_modules/sass-versioning/dist/_index.scss';\n\n`,
		styleOutput: 'css'
	};

	PrepareBundle( data )
		.then( data => expect( data ).toEqual( preparedData ) );

});


test('PrepareBundle: prepares bundle for react and sassModules.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'sassModules',
		jsOutput: 'react',
	};

	const promiseMock = new Promise ( ( resolve, reject ) => {
		resolve();
	});

	const preparedData = {
		cssImports: `@import 'uikit/packages/core/node_modules/sass-versioning/dist/_index.scss';\n\n`,
		jsMin: [],
		sassImports: `@import 'node_modules/sass-versioning/dist/_index.scss';\n
@import 'core/sass/_module.scss';
@import 'animate/sass/_module.scss';
@import 'accordion/sass/_module.scss';
@import 'link-list/sass/_module.scss';
@import 'body/sass/_module.scss';
@import 'breadcrumbs/sass/_module.scss';\n`,
		styleOutput: 'sassModules',
	};

	PrepareBundle( data )
		.then( data => expect( data ).toEqual( preparedData ) );

});


test('PrepareBundle: prepares bundle for react and cssModules.', () => {

	const data = {
		components: [ 'core', 'animate', 'accordion', 'link-list', 'body', 'breadcrumbs' ],
		styleOutput: 'cssModules',
		jsOutput: 'react',
	};

	const promiseMock = new Promise ( ( resolve, reject ) => {
		resolve();
	});

	const preparedData = {
		cssImports: `@import 'uikit/packages/core/node_modules/sass-versioning/dist/_index.scss';\n\n`,
		jsMin: [],
		sassImports: `@import 'node_modules/sass-versioning/dist/_index.scss';\n\n`,
		styleOutput: 'cssModules',
	};

	PrepareBundle( data )
		.then( data => expect( data ).toEqual( preparedData ) );

});



// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Bundle
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Bundle: gets all of the data for the zip files.', () => {

	const data = {
		jsMin: [
			Path.normalize( '__tests__/unit/mocks/js/mock1.js' ),
			Path.normalize( '__tests__/unit/mocks/js/mock2.js' ),
		],
		cssImports:  `@import '__tests__/unit/mocks/scss/mock1.scss';\n@import '__tests__/unit/mocks/scss/mock2.scss';`,
		bundle: [],
		styleOutput: 'css'
	};

	return Bundle( data )
		.then( data => expect( data ).toEqual( [ undefined, undefined ] ) );

});

test('Bundle: gets all of the data for the zip files with sass.', () => {

		const data = {
			jsMin: [],
			sassImports: `@import '__tests__/mocks/scss/mock1.scss';`,
			bundle: [],
			styleOutput: 'sassModules'
		};

		return Bundle( data )
			.then( data => expect( data ).toEqual( [ undefined, undefined ] ) );

	});


test('Bundle: invalid css.', () => {

	const data = {
		jsMin: [],
		cssImports: `@impo__tests__/mocksscss/mock2.scss';`,
		bundle: [],
		styleOutput: 'css'
	};

	return Bundle( data )
		.catch( error => expect( error.message ).toBe( `Invalid CSS after \"...scss/mock2.scss\": expected 1 selector or at-rule, was \"';\"` ));
});
