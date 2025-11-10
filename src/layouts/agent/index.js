// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
// Layout components
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { routeAjent as routes } from 'routes.js';
import CreateGICModal from '../../views/mainpages/agent/gic/GicForm';
import GicView from '../../views/mainpages/agent/gic/GicView';
import AgentForexView from '../../views/mainpages/agent/forex/AgentForexView';
import AgentProfilePage from 'views/mainpages/agent/profile/app_agent-profile_page';
import { useSelector } from 'react-redux';

// OSHC imports
import OshcForm from '../../views/mainpages/agent/oshc/OshcForm';
import OshcView from '../../views/mainpages/agent/oshc/OshcView';

// Student Funding imports
import StudentFundingForm from '../../views/mainpages/agent/studentFunding/StudentFundingForm';
import StudentFundingView from '../../views/mainpages/agent/studentFunding/StudentFundingView';

export default function Dashboard(props) {
  const { ...rest } = props;

  // States and functions
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.Auth);
// console.log(user)
  // Re-render on route changes
  useEffect(() => {}, [location]);

  // Helper functions
  const getActiveRoute = (routes) => {
    let activeRoute = 'Default Brand Text';
    for (const route of routes) {
      if (route.collapse) {
        const activeChildRoute = getActiveRoute(route.items);
        if (activeChildRoute !== activeRoute) return activeChildRoute;
      } else if (route.category) {
        const activeCategoryRoute = getActiveRoute(route.items);
        if (activeCategoryRoute !== activeRoute) return activeCategoryRoute;
      } else if (window.location.href.includes(route.layout + route.path)) {
        return route.name;
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    for (const route of routes) {
      if (route.collapse) return getActiveNavbar(route.items);
      if (route.category) return getActiveNavbar(route.items);
      if (window.location.href.includes(route.layout + route.path)) {
        return route.secondary;
      }
    }
    return false;
  };

  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      if (route.layout === '/agent') {
        return (
          <Route path={route.path} element={route.component} key={key} />
        );
      }
      if (route.collapse) {
        return getRoutes(route.items);
      }
      return null;
    });
  };

  const { onOpen } = useDisclosure();

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        {/* Sidebar for large screens */}
        <Sidebar routes={routes} display={{ base: 'none', xl: 'block' }} {...rest} />


        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc(100% - 290px)' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        >
          <Portal>
            <Navbar
              onOpen={onOpen}
              logoText="abroad educare"
              brandText={getActiveRoute(routes)}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
          </Portal>

          <Box
            mx="auto"
            p={{ base: '20px', md: '30px' }}
            pt={{ base: '200px', md: '130px', xl: '130px' }}
            minH="100vh"
          >
            <Routes>
              {getRoutes(routes)}
              <Route path="/" element={<Navigate to="/agent/default" replace />} />
              <Route path= "/profile" element={<AgentProfilePage agentData={user}/>} />
              <Route path="/gic/form" element={<CreateGICModal />} />
              <Route path="/gic/:id" element={<GicView />} />
              <Route path="/forex/:id" element={<AgentForexView />} />
              <Route path="/oshc/add" element={<OshcForm />} />
              <Route path="/oshc/edit/:id" element={<OshcForm />} />
              <Route path="/oshc/view/:id" element={<OshcView />} />
              <Route path="/student-funding/add" element={<StudentFundingForm />} />
              <Route path="/student-funding/edit/:id" element={<StudentFundingForm />} />
              <Route path="/student-funding/view/:id" element={<StudentFundingView />} />
            </Routes>
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
