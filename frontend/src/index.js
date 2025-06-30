import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TourProvider } from './context/TourContext';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TourProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </TourProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
