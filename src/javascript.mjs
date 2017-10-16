import { Log } from './helper';

export const GetJs = ( data ) => {
	Log.verbose( `Running GetJs`);

	data.js = "js minified";

	console.log( data );
	return data;
}
