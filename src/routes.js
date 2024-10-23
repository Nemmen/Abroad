import React from 'react';

import { Icon } from '@chakra-ui/react';

import {
  MdPerson,
  MdHome,
  MdAttachMoney,
  MdSwapHoriz,
  MdBusiness,
} from 'react-icons/md';

import { SiAuthentik } from 'react-icons/si';

import Agent from './views/mainpages/agent';

//Auth import
import Login from 'views/mainpages/login_signup/Login';
import Signup from 'views/mainpages/login_signup/Signup';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: '',
  },
  {
    name: 'Agent',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: '',
    secondary: true,
  },
];

export const routeAjent = [
  {
    name: 'Main Dashboard',
    layout: '/agent',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Agent />,
  },
  {
    name: 'GIC',
    layout: '/agent',
    path: '/gic',
    icon: (
      <Icon as={MdAttachMoney} width="20px" height="20px" color="inherit" />
    ),
    component: '',
    secondary: true,
  },
  {
    name: 'FOREX',
    layout: '/agent',
    icon: <Icon as={MdSwapHoriz} width="20px" height="20px" color="inherit" />,
    path: '/forex',
    component: '',
  },
  {
    name: 'IMM',
    layout: '/agent',
    path: '/imm',
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    component: '',
  },
];

// for commiy
export const Auth = [
  {
    name: 'Login',
    layout: '/auth',
    path: '/login',
    icon: <Icon as={SiAuthentik} width="20px" height="20px" color="inherit" />,
    component: <Login />,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/signup',
    icon: <Icon as={SiAuthentik} width="20px" height="20px" color="inherit" />,
    component: <Signup />,
  },
];

export default routes;
