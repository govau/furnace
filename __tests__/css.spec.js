import { GetMinCss } from '../src/css';

const sass = `$red: red; .card{ background-color: $red; border-radius:10px; }`;
const css = `.card{ background-color: red; border-radius:10px; }`;

describe('GetMinCss', () => {
	it('should minify and autoprefix a scss string', () => {
		expect( GetMinCss( sass ).toBe( css ) )
	})
})
