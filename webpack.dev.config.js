const merge = require('webpack-merge');

const base = require('./webpack.base.config');

const { PORT = 9000 } = process.env;

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: PORT,
  },
});
