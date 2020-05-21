const merge = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const base = require('./webpack.base.config');

const { PORT = 9000 } = process.env;

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [new ReactRefreshWebpackPlugin()],
  devServer: {
    port: PORT,
    hot: true,
  },
});
