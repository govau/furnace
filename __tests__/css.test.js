const GetMinCss = require( '../dist/css.mjs' );

const sass = `$red: red; .card { background-color: $red; border-radius:10px; }`;

const css = ``;

describe('GetMinCss', () => {
	it('should minify and autoprefix a scss string', () => {
		expect( GetMinCss( sass ).toBe( css ) )
	})
})
