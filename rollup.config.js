import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

import info from './package.json';


export default {
	input: 'src/index.js',
	output: {
		file: 'dist/index.js',
		format: 'umd',
		name: 'notator',
		banner: `/**
* NOTATOR v${info.version}
* © 2018 JohH <code@johh.net>
* licensed under BSD-4-Clause
* https://johh.net/notator
**/`,
		intro: `
console.groupCollapsed('%c№ — notator', 'font-size: large; font-family: sans-serif;');
console.log( '${info.description}' );
console.log( '${info.homepage}' );
console.log( '%cv${info.version}', 'font: monospace; color: #666;' );
console.groupEnd();
`,
	},
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**', // only transpile our source code
			plugins: ['external-helpers'],
		}),
		uglify({
			output: {
				comments: /^\*/,
			},
		}),
	],
};
