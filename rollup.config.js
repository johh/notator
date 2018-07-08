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
	},
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**', // only transpile our source code
		}),
		uglify({
			output: {
				comments: /^\*/,
			},
		}),
	],
};
