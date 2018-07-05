const path = require( 'path' );
const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const ScriptExtHtmlWebpackPlugin = require( 'script-ext-html-webpack-plugin' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const StyleExtHtmlWebpackPlugin = require( 'style-ext-html-webpack-plugin' );
const { BundleAnalyzerPlugin } = require( 'webpack-bundle-analyzer' );

const isProd = process.env.NODE_ENV && process.env.NODE_ENV === 'production';


const paths = {
	DIST: path.resolve( __dirname, 'dist' ),
	SRC: path.resolve( __dirname, 'src' ),
	ASSETS: 'assets/',
};

// Webpack configuration
const config = {
	entry: path.join( paths.SRC, 'index.js' ),
	output: {
		path: paths.DIST,
		filename: 'app.bundle.[hash:8].js',
		chunkFilename: 'app.chunk-[id].[chunkhash:8].js',
	},

	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			template: path.join( paths.SRC, 'index.html' ),
			filename: path.join( paths.DIST, 'index.html' ),
		}),
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: 'async',
		}),
		new ExtractTextPlugin( 'styles.css' ),
		new StyleExtHtmlWebpackPlugin({
			position: 'plugin',
			minify: true,
		}),
	],

	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
				],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						outputPath: paths.ASSETS,
						name: '[name].[hash:8].[ext]',
					},
				},
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader',
				}),
			},
			{
				test: /\.(woff|woff2|ttf|eot)$/,
				use: {
					loader: 'file-loader',
					options: {
						outputPath: path.join( paths.ASSETS, 'fonts' ),
						name: '[name].[hash:8].[ext]',
					},
				},
			},
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				loader: 'shader-loader',
			},
		],
	},

	resolve: {
		extensions: ['.js', '.jsx'],
	},

	devServer: {
		port: 3000,
		compress: true,
		historyApiFallback: true,
	},
};


if ( isProd ) {
	config.plugins = config.plugins.concat([
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify( 'production' ),
			},
		}),
	]);
}

if ( process.env.ANALYZE && process.env.ANALYZE === '1' ) {
	config.plugins = config.plugins.concat([
		new BundleAnalyzerPlugin(),
	]);
}

module.exports = config;
