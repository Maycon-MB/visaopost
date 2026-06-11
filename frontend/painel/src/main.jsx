import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import './styles.css';
import App from './App.jsx';
import { ThemeProvider } from './theme-context.jsx';
import { AuthProvider } from './auth-context.jsx';
import { DEMO } from './config.js';

// Demo (GitHub Pages, path /visaopost/app/) usa HashRouter — sem config de server.
const Router = DEMO ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
);
