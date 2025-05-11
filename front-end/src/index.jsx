import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import { ApiProvider } from './context/ApiContext.jsx';
import { DateProvider } from "./context/DateContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <ApiProvider>
      <DateProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </DateProvider>
    </ApiProvider>
  </AuthProvider>
);


