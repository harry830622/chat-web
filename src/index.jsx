import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import 'sanitize.css';
import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';

import App from './components/App';

const theme = {
  color: {
    primary: '#c86b85',
    secondary: '#f5eee6',
  },
};

ReactDOM.render(
  <>
    <Helmet>
      <title>Chat</title>
    </Helmet>
    <Global
      styles={css`
        *:focus {
          outline: none;
        }

        html,
        body,
        #react {
          height: 100%;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
            'Noto Color Emoji';
        }
      `}
    />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </>,
  document.querySelector('#react'),
);
