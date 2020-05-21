const { NODE_ENV, BABEL_ENV } = process.env;

const devPlugins = ['react-refresh/babel'];

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    [
      '@babel/preset-react',
      {
        development: BABEL_ENV === 'development',
      },
    ],
    '@emotion/babel-preset-css-prop',
  ],
  plugins: [
    ['emotion', { sourceMap: BABEL_ENV === 'development' }],
    ...(NODE_ENV === 'development' ? devPlugins : []),
  ],
};
