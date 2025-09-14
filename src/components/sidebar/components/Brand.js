import React from 'react';

// Chakra imports
import { Flex, Img, useColorModeValue } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

import { HSeparator } from 'components/separator/Separator';
import { Text } from '@chakra-ui/react';

export function SidebarBrand() {
  const location = useLocation();
  
  // Determine the dashboard link based on current layout
  const getDashboardLink = () => {
    if (location.pathname.includes('/admin')) {
      return '/admin/default';
    } else if (location.pathname.includes('/agent')) {
      return '/agent/default';
    }
    return '/'; // fallback
  };

  return (
    <Flex align="center" direction="column">
      <Link to={getDashboardLink()}>
        <img 
          className="mb-5" 
          src="/Logo.png" 
          alt="Abrocare" 
          style={{ 
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        />
      </Link>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
