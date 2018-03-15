/***************************************************************************************************************************************************************
 *
 * settings.js unit tests
 *
 * @file - src/settings.js
 *
 * Tested methods:
 * SETTINGS
 *
 **************************************************************************************************************************************************************/


// -------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
// -------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Settings } from '../../src/settings';
import Path         from 'path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// SETTINGS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
test('Settings.get() - The default settings are correct', () => {
	const defaults = {
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
			sassVersioning: Path.normalize(`node_modules/sass-versioning/dist/_index.scss`),
		},
		uikit: {
			dist: Path.normalize(`${ process.cwd() }/dist/`),
			json: {},
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
			name: 'furnace',
			version: '1.0.0',
			description: 'Australian Government - Design System',
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
					minified: false,
					location: 'js/',
					name: 'furnace.min.js'
				},
				react: {
					location: 'react/'
				}
			}
		}
	};

	expect( Settings.get() ).toMatchObject( defaults );
});


test('Settings.set() - Not setting anything will merge default correctly', () => {
	const changes = undefined;
	const settings = {
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
			sassVersioning: Path.normalize(`node_modules/sass-versioning/dist/_index.scss`),
		},
		uikit: {
			dist: Path.normalize(`${ process.cwd() }/dist/`),
			json: {},
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
			name: 'furnace',
			version: '1.0.0',
			description: 'Australian Government - Design System',
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
					minified: false,
					location: 'js/',
					name: 'furnace.min.js'
				},
				react: {
					location: 'react/'
				}
			}
		}
	};

	expect( Settings.set( changes ) ).toMatchObject( settings );
});


test('Settings.set() - An empty object as settings folder will merge default correctly', () => {
	const changes = {};
	const settings = {};

	expect( Settings.set( changes ) ).toMatchObject( settings );
});


test('Settings.set() - Set settings correctly', () => {

	const newSettings = Settings.get();

	newSettings.folder.cwd = 'test';
	newSettings.server.root = 'test';
	newSettings.npm.sassVersioning = 'test';
	newSettings.uikit.abc = 'test';

	const settings = {
		folder: {
			cwd: 'test',
			site: Path.normalize(`${ process.cwd() }/site/`),
		},
		server: {
			root: 'test',
			port: 8080,
			redirect: 'https://gold.service.gov.au',
		},
		npm: {
			sassVersioning: 'test',
		},
		uikit: {
			abc: 'test',
			dist: Path.normalize(`${ process.cwd() }/dist/`),
			json: {},
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
			name: 'furnace',
			version: '1.0.0',
			description: 'Australian Government - Design System',
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
					minified: false,
					location: 'js/',
					name: 'furnace.min.js'
				},
				react: {
					location: 'react/'
				}
			}
		}
	};

	expect( Settings.set( newSettings ) ).toMatchObject( settings );
});
