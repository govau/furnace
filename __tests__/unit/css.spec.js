/***************************************************************************************************************************************************************
 *
 * Css.js unit tests
 *
 * @file src/css.js
 *
 * Tested methods:
 * - GetMinCss
 * - Autoprefix
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { GetMinCss, Autoprefix } from '../../src/css';


// ----------------------------------------------------------------
// GetMinCss
// ----------------------------------------------------------------
test('GetMinCss: should minify and autoprefix a scss string', () => {
	const sass = `$red: red; .card{ background-color: $red; box-shadow: 10px 10px 10px #000; }`;
	const css = `.card{background-color:red;-webkit-box-shadow:10px 10px 10px #000;box-shadow:10px 10px 10px #000}\n`;

	GetMinCss( sass ).then( data => expect( data ).toBe( css ) );

});


test('GetMinCss: should throw an error', () => {

	GetMinCss( 'asasasdad' )
		.catch( error => expect( error.message ).toBe( `Invalid CSS after "asasasdad": expected "{", was ""` ) );
});


// ----------------------------------------------------------------
// Autoprefixer
// ----------------------------------------------------------------
test('Autoprefixer: should throw a warning', () => {
	console.warn = jest.fn();
	const sass = 'body { display: box; }';
	const warning = `autoprefixer: <css input>:1:6: You should write display: flex by final spec instead of display: box`;

	return GetMinCss( sass )
		.then( css => {
			expect( console.warn.mock.calls.length ).toBe( 1 );
			expect( console.warn.mock.calls[0][0] ).toBe( warning );
		});
});


test('Autoprefixer: should throw a warning', () => {
	Autoprefix( 'asasasdad' )
		.catch( error => error => expect( error.message ).toBe( `<css input>:1:1: Unknown word` ) );
});


