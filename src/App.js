import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import AgentLayout from './layouts/agent';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import PublicLayouts from 'views/mainpages/Layouts/PublicLayouts';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const isAuthenticated = () => {
    const token = localStorage.getItem('token_auth');
    return token !== null;
  };

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


return (
  <ChakraProvider theme={currentTheme}>
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />

      {/* Protected Routes */}
      <Route
        path="admin/*"
        element={
          <ProtectedRoute adminChildren={<AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />} />
        }
      />
      <Route
        path="agent/*"
        element={
          <ProtectedRoute agentChildren={<AgentLayout theme={currentTheme} setTheme={setCurrentTheme} />} />
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  </ChakraProvider>
);

}
