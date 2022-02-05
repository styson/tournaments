import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Amplify from 'aws-amplify';
import App from './App';
import config from './aws-exports';
import React from 'react';
import ReactDOM from 'react-dom';

Amplify.configure(config);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);