import React from 'react';

import { Icon } from '@chakra-ui/react';
import { BsFillPiggyBankFill } from "react-icons/bs";
import {
  MdPerson,
  MdHome,
  MdAttachMoney,
  MdSwapHoriz,
  MdBusiness,
  MdVerifiedUser,
  MdContactSupport,
  MdLocalHospital,
  MdAccountBalance,
  MdPayment
} from 'react-icons/md';

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
import ForexDashboard from 'views/mainpages/admin/forex/ForexDashboard';
import AgentForex from './views/mainpages/agent/forex/AgentForex.jsx'
import BlockedPage from 'views/mainpages/agent/blocked/BlockedPage';
import StudentPage from 'views/mainpages/agent/students/StudentPage';
import ForgotPassword from "views/mainpages/login_signup/ForgotPassword";
import ResetPassword from "views/mainpages/login_signup/ResetPassword";
import EmailTemplateGen from 'views/mainpages/admin/main/components/EmailTemplateGen';
import Enquiry from 'views/mainpages/admin/enquiry/Enquiry';

// OSHC imports
import OshcPage from 'views/mainpages/agent/oshc/OshcPage';
import OshcForm from 'views/mainpages/agent/oshc/OshcForm';
import OshcView from 'views/mainpages/agent/oshc/OshcView';
import AdminOshc from 'views/mainpages/admin/oshc/AdminOshc';
import AdminOshcForm from 'views/mainpages/admin/oshc/AdminOshcForm';
import AdminOshcView from 'views/mainpages/admin/oshc/AdminOshcView';

// Student Funding imports
import StudentFundingPage from 'views/mainpages/agent/studentFunding/StudentFundingPage';
import StudentFundingForm from 'views/mainpages/agent/studentFunding/StudentFundingForm';
import StudentFundingView from 'views/mainpages/agent/studentFunding/StudentFundingView';
import AdminStudentFunding from 'views/mainpages/admin/studentFunding/AdminStudentFunding';
import AdminStudentFundingForm from 'views/mainpages/admin/studentFunding/AdminStudentFundingForm';
import AdminStudentFundingView from 'views/mainpages/admin/studentFunding/AdminStudentFundingView';

// Payment Tagging imports
import AgentPaymentTagging from 'views/mainpages/agent/paymentTagging/AgentPaymentTagging';
import PaymentTaggingForm from 'views/mainpages/agent/paymentTagging/PaymentTaggingForm';
import AgentPaymentTaggingView from 'views/mainpages/agent/paymentTagging/AgentPaymentTaggingView';
import AdminPaymentTagging from 'views/mainpages/admin/paymentTagging/AdminPaymentTagging';
import AdminPaymentTaggingForm from 'views/mainpages/admin/paymentTagging/AdminPaymentTaggingForm';
import AdminPaymentTaggingView from 'views/mainpages/admin/paymentTagging/AdminPaymentTaggingView';

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
    component: <Forex/>
  },
  {
  name: 'Exchange Requests',
    layout: '/admin',
    icon: <Icon as={MdSwapHoriz} width="20px" height="20px" color="inherit" />,
    path: '/exchange-req',
    component: <ForexDashboard />,
  },
  {
    name: 'EMAIL PROMOTIONS',
    layout: '/admin',
    icon: <Icon as={MdSwapHoriz} width="20px" height="20px" color="inherit" />,
    path: '/email-promotions',
    component: <EmailTemplateGen/>,
  },
  {
    name: 'Website Enquiries',
    layout: '/admin',
    icon: <Icon as={MdContactSupport} width="20px" height="20px" color="inherit" />,
    path: '/enquiry',
    component: <Enquiry/>,
  },
  {
    name: 'Insurance',
    layout: '/admin',
    icon: <Icon as={MdLocalHospital} width="20px" height="20px" color="inherit" />,
    path: '/oshc',
    component: <AdminOshc/>,
  },
  {
    layout: '/admin',
    path: '/oshc/add',
    component: <AdminOshcForm/>,
  },
  {
    layout: '/admin',
    path: '/oshc/edit/:id',
    component: <AdminOshcForm/>,
  },
  {
    layout: '/admin',
    path: '/oshc/view/:id',
    component: <AdminOshcView/>,
  },
  {
    name: 'Student Funding',
    layout: '/admin',
    icon: <Icon as={MdAccountBalance} width="20px" height="20px" color="inherit" />,
    path: '/student-funding',
    component: <AdminStudentFunding/>,
  },
  {
    layout: '/admin',
    path: '/student-funding/add',
    component: <AdminStudentFundingForm/>,
  },
  {
    layout: '/admin',
    path: '/student-funding/edit/:id',
    component: <AdminStudentFundingForm/>,
  },
  {
    layout: '/admin',
    path: '/student-funding/view/:id',
    component: <AdminStudentFundingView/>,
  },
  {
    name: 'Payment Tagging',
    layout: '/admin',
    icon: <Icon as={MdPayment} width="20px" height="20px" color="inherit" />,
    path: '/payment-tagging',
    component: <AdminPaymentTagging/>,
  },
  {
    layout: '/admin',
    path: '/payment-tagging/form',
    component: <AdminPaymentTaggingForm/>,
  },
  {
    layout: '/admin',
    path: '/payment-tagging/form/:id',
    component: <AdminPaymentTaggingForm/>,
  },
  {
    layout: '/admin',
    path: '/payment-tagging/view/:id',
    component: <AdminPaymentTaggingView/>,
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
    name: 'GIC / Blocked Account',
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

  // {
  //   name: 'Blocked',
  //   layout: '/agent',
  //   path: '/blocked',
  //   icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
  //   component: <BlockedPage/>,
  // },
  {
    name: 'Students',
    layout: '/agent',
    path: '/students',
    icon: <Icon as={MdVerifiedUser} width="20px" height="20px" color="inherit" />,
    component: <StudentPage/>,
  },
  {
    name: 'Insurance',
    layout: '/agent',
    path: '/oshc',
    icon: <Icon as={MdLocalHospital} width="20px" height="20px" color="inherit" />,
    component: <OshcPage/>,
  },
  {
    layout: '/agent',
    path: '/oshc/add',
    component: <OshcForm/>,
  },
  {
    layout: '/agent',
    path: '/oshc/edit/:id',
    component: <OshcForm/>,
  },
  {
    layout: '/agent',
    path: '/oshc/view/:id',
    component: <OshcView/>,
  },
  {
    name: 'Student Funding',
    layout: '/agent',
    path: '/student-funding',
    icon: <Icon as={MdAccountBalance} width="20px" height="20px" color="inherit" />,
    component: <StudentFundingPage/>,
  },
  {
    layout: '/agent',
    path: '/student-funding/add',
    component: <StudentFundingForm/>,
  },
  {
    layout: '/agent',
    path: '/student-funding/edit/:id',
    component: <StudentFundingForm/>,
  },
  {
    layout: '/agent',
    path: '/student-funding/view/:id',
    component: <StudentFundingView/>,
  },
  {
    name: 'Payment Tagging',
    layout: '/agent',
    icon: <Icon as={MdPayment} width="20px" height="20px" color="inherit" />,
    path: '/payment-tagging',
    component: <AgentPaymentTagging/>,
  },
  {
    layout: '/agent',
    path: '/payment-tagging/form',
    component: <PaymentTaggingForm/>,
  },
  {
    layout: '/agent',
    path: '/payment-tagging/form/:id',
    component: <PaymentTaggingForm/>,
  },
  {
    layout: '/agent',
    path: '/payment-tagging/view/:id',
    component: <AgentPaymentTaggingView/>,
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
    icon: <Icon as={BsFillPiggyBankFill} width="20px" height="20px" color="inherit" />,
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
