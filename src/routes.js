import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';

import { SiAuthentik } from "react-icons/si";

import Agent from './views/mainpages/agent'

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
    name: 'NFT Marketplace',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: '',
    secondary: true,
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: '',
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component:'',
  },
];




export const routeAjent = [
  {
    name: 'Main Dashboard ajent',
    layout: '/agent',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <Agent />,
  },
  {
    name: 'NFT Marketplace yes agent',
    layout: '/agent',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: '',
    secondary: true,
  },
  {
    name: 'Data Tables',
    layout: '/agent',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: '',
  },
  {
    name: 'Profile',
    layout: '/agent',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component:'',
  },
];

// fpr doing commit
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
