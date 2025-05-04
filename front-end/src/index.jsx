import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ApiProvider } from './context/ApiContext.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <ApiProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <App />
    </ApiProvider>
  </AuthProvider>
);


