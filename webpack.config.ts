import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
// import nodeExternals from 'webpack-node-externals'
import webpack from 'webpack'

const config: webpack.Configuration = {
  target: 'web',

  // externals: [nodeExternals()],

  mode: 'development',

  // devtool: false,
  devtool: 'source-map',

  entry: {
    main: './src/ts/main.ts',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['browser', 'module', 'main'],
    symlinks: false,
  },

  output: {
    chunkFilename: '[name].js',
    filename: '[name].js',
  },

  node: false,

  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: './manifest.json', to: './manifest.json' }],
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      fix: true,
      failOnError: true,
    }),
  ],
  optimization: {
    // minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },
}

module.exports = config
