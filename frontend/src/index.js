import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Auth from './Auth';
import { AuthProvider, useAuth } from './AuthContext';

function Root() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <App /> : <Auth />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>
);
