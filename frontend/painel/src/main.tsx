import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import './styles.css';
import App from './App';
import { ThemeProvider } from './theme-context';
import { AuthProvider } from './auth-context';
import { DEMO } from './config';

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
