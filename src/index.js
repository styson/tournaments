import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import { Amplify } from 'aws-amplify';
import App from './App';
import config from './aws-exports';
import React from 'react';
import { createRoot } from 'react-dom/client';

Amplify.configure(config);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);