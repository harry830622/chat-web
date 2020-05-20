import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import 'sanitize.css';
import { Global, css } from '@emotion/core';

import App from './components/App';

ReactDOM.render(
  <>
    <Helmet>
      <title>Chat</title>
    </Helmet>
    <Global
      styles={css`
        html,
        body,
        #react {
          height: 100%;
        }
      `}
    />
    <App />
  </>,
  document.querySelector('#react'),
);
