const path = require('path');

const webpack = require('webpack');

const WebpackNodeExternals = require('webpack-node-externals');
const ReloadServerPlugin = require('reload-server-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const cwd = process.cwd();

module.exports = (_, { mode }) => {
  const isProduction = mode === 'production';
  const externals = [
    WebpackNodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
      whitelist: [/@agriness/],
    }),
  ];
  const plugins = [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
  ];

  if (!isProduction) {
    externals.push(
      WebpackNodeExternals({
        whitelist: ['webpack/hot/poll?1000'],
      }),
    );

    plugins.push(
      new ReloadServerPlugin({
        script: path.resolve('build', 'server.js'),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.SourceMapDevToolPlugin({
        sourceRoot: path.join(__dirname, '../src'),
        include: path.join(__dirname, '../build'),
      }),
    );
  }

  return {
    mode,
    externals,
    plugins,
    devtool: isProduction ? 'none' : 'source-map',
    entry: {
      server: ['./src/index.js'],
    },
    output: {
      path: path.resolve('build'),
      filename: 'server.js',
    },
    watch: !isProduction,
    target: 'node',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        {
          test: /\.(js|jsx|ts|tsx)?$/,
          use: {
            loader: 'babel-loader',
          },
          exclude: [/node_modules/],
          include: [path.join(cwd, 'src'), path.join(cwd, '../')],
        },
      ],
    },
  };
};
