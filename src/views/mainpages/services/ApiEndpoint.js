// ApiEndpoint.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://abroad-backend-gray.vercel.app',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Functions to handle different request types
export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);
export const put = (url, data) => instance.put(url, data);
export const deleteRequest = (url) => instance.delete(url);
// Legacy alias for backwards compatibility
export const deleteUser = (url) => instance.delete(url);

// New function for handling multipart form-data uploads
export const postWithFiles = (url, data) => {
  return instance.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Request and response interceptors with token handling
instance.interceptors.request.use(
  function (config) {
    // Get the token from localStorage
    const token = localStorage.getItem('token_auth');
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

// =====================================================
// DELETE API Service Functions
// =====================================================

/**
 * Delete a Forex request (Admin only)
 * DELETE /api/forex/request/:id
 */
export const deleteForexRequest = (id) => {
  return instance.delete(`/api/forex/request/${id}`);
};

/**
 * Delete a GIC form
 * DELETE /auth/deleteGicForm/:id
 */
export const deleteGicForm = (id) => {
  return instance.delete(`/auth/deleteGicForm/${id}`);
};

/**
 * Delete a Blocked Account record
 * DELETE /auth/deleteBlockedAccount/:id
 */
export const deleteBlockedAccount = (id) => {
  return instance.delete(`/auth/deleteBlockedAccount/${id}`);
};

/**
 * Delete an OSHC entry (Agents: own only, Admins: all)
 * DELETE /api/oshc/:id
 */
export const deleteOshc = (id) => {
  return instance.delete(`/api/oshc/${id}`);
};

/**
 * Delete a Student Funding request (Admin only)
 * DELETE /api/student-funding/admin/delete/:id
 */
export const deleteStudentFunding = (id) => {
  return instance.delete(`/api/student-funding/admin/delete/${id}`);
};

/**
 * Delete a Payment Tagging record (Admin only)
 * DELETE /api/payment-tagging/admin/delete/:id
 */
export const deletePaymentTagging = (id) => {
  return instance.delete(`/api/payment-tagging/admin/delete/${id}`);
};

export default instance;
