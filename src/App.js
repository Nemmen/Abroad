import './App.css';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import AgentLayout from './layouts/agent';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import PublicLayouts from 'views/mainpages/Layouts/PublicLayouts';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token_auth');
    return token !== null;
  };

  // Function to get user role (this can be based on token or stored in localStorage separately)
  const getUserRole = () => {
    return localStorage.getItem('user_role'); // Assuming role is stored in localStorage as 'user_role'
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/auth/login" replace />;
    }

    // Redirect based on role
    const role = getUserRole();
    if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'user') {
      return <Navigate to="/agent" replace />;
    }

    return children; // Render the protected content
  };

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        
        {/* Protected Routes */}
        <Route
          path="admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="agent/*"
          element={
            <ProtectedRoute>
              <AgentLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="auth/*"
          element={<PublicLayouts />}
        />
        
        {/* Redirect root to admin */}
        {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
      </Routes>
    </ChakraProvider>
  );
}
