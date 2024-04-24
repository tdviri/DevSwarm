import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AppProvider } from './components/appContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
