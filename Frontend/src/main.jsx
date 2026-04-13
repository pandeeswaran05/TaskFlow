import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/Authcontext.jsx';
import { ToastProvider } from './Context/ToastContext.jsx';
import React from 'react';

createRoot(document.getElementById('root')).render(
 <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        < App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
)
