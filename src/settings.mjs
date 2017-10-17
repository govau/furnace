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
	node_modules: {
		sassVersioning: Path.normalize(`${ process.cwd() }/node_modules/sass-versioning/dist/_index.scss`),
	},
	uikit: {
		root: Path.normalize(`${ process.cwd() }/uikit/`),
		components: Path.normalize(`${ process.cwd() }/uikit/packages/`),
		dist: Path.normalize(`${ process.cwd() }/dist/`),
		json: Path.normalize( `${ process.cwd() }/uikit/uikit.json` )
	}
};
