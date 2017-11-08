/***************************************************************************************************************************************************************
 *
 * TESTS
 *
 * The tests to be ran in tester.js
 *
 **************************************************************************************************************************************************************/


const TESTS = module.exports = [
	{
		name: 'Test1: testing minified css, minified js and dependency fetching.',
		folder: 'zip-01',
		post: {
			components: [ 'accordion', 'breadcrumbs' ],
			styleOutput: 'css',
			jsOutput: 'js',
		},
		compare: 'GOLD-AU/',
		empty: false,
	},
	{
		name: 'Test2: testing css modules, js modules and dependency fetching.',
		folder: 'zip-02',
		post: {
			components: [ 'accordion', 'breadcrumbs' ],
			styleOutput: 'cssModules',
			jsOutput: 'jsModules',
		},
		compare: 'GOLD-AU/',
		empty: false,
	},
	{
		name: 'Test3: testing sass modules, react and dependency fetching.',
		folder: 'zip-03',
		post: {
			components: [ 'accordion', 'breadcrumbs' ],
			styleOutput: 'sassModules',
			jsOutput: 'react',
		},
		compare: 'GOLD-AU/',
		empty: false,
	},
	{
		name: 'Test4: testing all modules with minified css and minified js.',
		folder: 'zip-04',
		post: {
			components: [
				'core',
				'animate',
				'accordion',
				'body',
				'link-list',
				'breadcrumbs',
				'buttons',
				'callout',
				'control-input',
				'cta-link',
				'direction-links',
				'footer',
				'grid-12',
				'header',
				'headings',
				'inpage-nav',
				'keyword-list',
				'page-alerts',
				'progress-indicator',
				'responsive-media',
				'select',
				'skip-link',
				'tags',
				'text-inputs'
			],
			styleOutput: 'cssMin',
			jsOutput: 'jsMin',
		},
		compare: 'GOLD-AU/',
		empty: false,
	},
];


