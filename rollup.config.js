import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/notator.ts',

	output: [
		{
			file: 'dist/esm/notator.js',
			format: 'esm',
		},
		{
			file: 'dist/cjs/notator.js',
			format: 'cjs',
		},
	],

	plugins: [
		typescript(),
	],
};
