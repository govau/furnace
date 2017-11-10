/***************************************************************************************************************************************************************
 *
 * Settings used throughout the application
 *
 * SETTINGS - Keeping our settings across multiple imports
 *
 **************************************************************************************************************************************************************/


'use strict';


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import Path from 'path';
import Fs   from 'fs';



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
		sassVersioning: Path.normalize(`uikit/packages/core/node_modules/sass-versioning/dist/_index.scss`),
	},
	uikit: {
		dist: Path.normalize(`${ process.cwd() }/dist/`),
		json: JSON.parse( Fs.readFileSync( Path.normalize( `${ process.cwd() }/uikit/uikit.json` ), "utf-8" ) ),
		prefix: '@gov.au/',
		styleOutput: {
			css: {
				option: 'css',
			},
			cssModules: {
				option: 'cssModules',
			},
			sassModules: {
				option: 'sassModules',
			},
		},
		jsOutput: {
			js: {
				option: 'js',
				fileName: 'module',
				directory: 'js',
			},
			jsModules:  {
				option: 'jsModules',
				fileName: 'module',
				directory: 'js',
			},
			jquery: {
				option: 'jquery',
				fileName: 'jquery',
				directory: 'jquery',
			},
			jqueryModules: {
				option: 'jqueryModules',
				fileName: 'jquery',
				directory: 'jquery',
			},
			react: {
				option: 'react',
				fileName: 'react',
				directory: 'react',
			},
		},
	},
	packageJson: {
		name: 'Furnace',
		version: '1.0.0',
		description: 'Furnace has smelted this project from the finest GOLD',
		license: 'MIT',
		dependencies: {},
		pancake: {
			'auto-save': true,
			plugins: true,
			ignore: [],
			css: {
				minified: false,
				browsers: [
					'last 2 versions',
					'ie 8',
					'ie 9',
					'ie 10'
				],
				location: 'css/',
				name: 'furnace.min.css'
			},
			sass: {
				location: './',
				name: 'main.scss'
			},
			js: {
				minified: 'false',
				location: 'js/',
				name: 'furnace.min.js'
			},
			react: {
				location: 'react/'
			}
		}
	}
};
