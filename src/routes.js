import React from 'react';

import { Icon } from '@chakra-ui/react';
import { BsFillPiggyBankFill } from "react-icons/bs";
import {
  MdPerson,
  MdHome,
  MdAttachMoney,
  MdSwapHoriz,
  MdBusiness,
  MdVerifiedUser
} from 'react-icons/md';
import { CgProfile } from "react-icons/cg";

import { SiAuthentik } from 'react-icons/si';

import Agent from './views/mainpages/agent';

//Auth import
import Login from 'views/mainpages/login_signup/Login';
import Signup from 'views/mainpages/login_signup/Signup';
import MainDashboard from 'views/mainpages/admin/main/MainDashboard';
import AdminAgent from 'views/mainpages/admin/agent/Agent'
import GicPage from 'views/mainpages/agent/gic/GicPage';
import Gic from 'views/mainpages/admin/gic/Gic';
import Forex from 'views/mainpages/admin/forex/Forex';
import AgentForex from './views/mainpages/agent/forex/AgentForex.jsx'
import BlockedPage from 'views/mainpages/agent/blocked/BlockedPage';
import StudentPage from 'views/mainpages/agent/students/StudentPage';
import Profile from 'views/mainpages/agent/profile/Profile';

import ForgotPassword from "views/mainpages/login_signup/ForgotPassword";
import ResetPassword from "views/mainpages/login_signup/ResetPassword";

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Agent',
    layout: '/admin',
    path: '/agent',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <AdminAgent />,
    secondary: true,
  },
  {
    name: 'GIC / Blocked Account',
    layout: '/admin',
    path: '/gic',
    icon: (
      <Icon as={MdAttachMoney} width="20px" height="20px" color="inherit" />
    ),
    component: <Gic />,
    secondary: true,
  },
  {
    name: 'FOREX',
    layout: '/admin',
    icon: <Icon as={MdSwapHoriz} width="20px" height="20px" color="inherit" />,
    path: '/forex',
    component: <Forex />,
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
    component: <GicPage/>,
    secondary: true,
  },
  {
    name: 'FOREX',
    layout: '/agent',
    icon: <Icon as={MdSwapHoriz} width="20px" height="20px" color="inherit" />,
    path: '/forex',
    component: <AgentForex/>,
  },

  {
    name: 'Blocked',
    layout: '/agent',
    path: '/blocked',
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    component: <BlockedPage/>,
  },
  {
    name: 'Students',
    layout: '/agent',
    path: '/students',
    icon: <Icon as={MdVerifiedUser} width="20px" height="20px" color="inherit" />,
    component: <StudentPage/>,
  },
  
];

// for commiy



export const Auth = [
  {
    name: "Login",
    layout: "/auth",
    path: "/login",
    icon: <Icon as={SiAuthentik} width="20px" height="20px" color="inherit" />,
    component: <Login />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "/signup",
    icon: <Icon as={BsFillPiggyBankFill} width="20px" height="20px" color="inherit" />,
    component: <Signup />,
  },
  {
    name: "Forgot Password",
    layout: "/auth",
    path: "/forgot-password",
    
    component: <ForgotPassword />,
  },
  {
    name: "Reset Password",
    layout: "/auth",
    path: "/reset-password",
    
    component: <ResetPassword />,
  },
];
export default routes;
