// ApiEndpoint.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:4000',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Functions to handle different request types
export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);
export const put = (url, data) => instance.put(url, data);
export const deleteUser = (url) => instance.delete(url);

// New function for handling multipart form-data uploads
export const postWithFiles = (url, data) => {
  return instance.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Request and response interceptors (unchanged)
instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // console.log('Interceptor response:', response);
    return response;
  },
  function (error) {
    console.log('Interceptor response:', error);
    return Promise.reject(error);
  }
);
