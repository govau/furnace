/**
 *
 * Get settings and merge with defaults
 *
 * SETTINGS     - Keeping our settings across multiple imports
 *
 */

'use strict';


// Dependencies
import Path from 'path';
import Fs from 'fs';



/**
 * Keeping our settings across multiple imports
 *
 * @type {Object}
 */
export const SETTINGS = {
	folder: {
		cwd: Path.normalize(`${ process.cwd() }/`),
		site: Path.normalize(`${ process.cwd() }/site/`),
	},
	server: {
		root: '/furnace/',
		port: 8080,
		redirect: 'https://gold.service.gov.au',
	},
	npm: {
		sassVersioning: Path.normalize(`${ process.cwd() }/node_modules/sass-versioning/dist/_index.scss`),
	},
	uikit: {
		root: Path.normalize(`${ process.cwd() }/uikit/`),
		componentsDir: Path.normalize(`${ process.cwd() }/uikit/packages/`),
		dist: Path.normalize(`${ process.cwd() }/dist/`),
		json: JSON.parse( Fs.readFileSync( Path.normalize( `${ process.cwd() }/uikit/uikit.json` ), "utf-8" ) ),
		prefix: '@gov.au/',
	},
};
