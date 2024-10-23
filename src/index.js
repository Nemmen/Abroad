import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// import './assets/css/App.css';
import './index.css'
import { Provider } from 'react-redux';
import { store } from './views/mainpages/redux/Store';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/400.css'; // Regular font weight
import '@fontsource/roboto/500.css'; // Medium font weight
import '@fontsource/roboto/700.css'; // Bold font weight


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
  <BrowserRouter>
    <App />
    <ToastContainer/>
  </BrowserRouter>
  </Provider>
);
