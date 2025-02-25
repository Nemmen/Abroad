import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import AgentLayout from './layouts/agent';
import Home from './layouts/home';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState, useEffect } from 'react';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token_auth');
    return token !== null;
  };

  // Get user role
  const getUserRole = () => {
    return localStorage.getItem('user_role');
  };

  // Protected Route Component
  const ProtectedRoute = ({ adminChildren, agentChildren }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/auth/login" replace />;
    }

    const role = getUserRole();

    if (role === 'admin') {
      return adminChildren; // Render admin-specific children
    } else if (role === 'user') {
      return agentChildren; // Render agent-specific children
    }

    // Fallback if no role matches
    return <Navigate to="/auth/login" replace />;
  };

  // Clear history and token on logout
  useEffect(() => {
    if (!isAuthenticated()) {
      // Clear history stack and local storage when logged out
      localStorage.removeItem('token_auth');
      localStorage.removeItem('user_role');
    }
  }, []);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/auth/login" replace />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="auth/*" element={<AuthLayout />} />

        {/* Protected Routes */}
        <Route
          path="admin/*"
          element={
            <ProtectedRoute
              adminChildren={
                <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
              }
            />
          }
        />
        <Route
          path="agent/*"
          element={
            <ProtectedRoute
              agentChildren={
                <AgentLayout theme={currentTheme} setTheme={setCurrentTheme} />
              }
            />
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </ChakraProvider>
  );
}
