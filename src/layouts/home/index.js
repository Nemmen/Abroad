// import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import hero from "../../assets/img/home/hero.jpg"
// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   return (
//     <>
  
//         <div className="antialiased bg-gray-100">
//           <div className="w-full text-gray-700 bg-white">
//             <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
//               <div className="flex flex-row items-center justify-between p-4">
//                 <a
//                   href="#"
//                   className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg focus:outline-none focus:shadow-outline"
//                 >
//                  AbroCare
//                 </a>
//                 <button
//                   className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 >
//                   <svg
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                     className="w-6 h-6"
//                   >
//                     {isMenuOpen ? (
//                       <path
//                         fillRule="evenodd"
//                         d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     ) : (
//                       <path
//                         fillRule="evenodd"
//                         d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
//                         clipRule="evenodd"
//                       />
//                     )}
//                   </svg>
//                 </button>
//               </div>
//               <nav
//                 className={`${
//                   isMenuOpen ? 'flex' : 'hidden'
//                 } flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row`}
//               >
//                 <a
//                   href="#"
//                   className="px-4 py-2 mt-2 text-sm tracking-wider bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
//                 >
//                  Home
//                 </a>
//                 <a
//                   href="#"
//                   className="px-4 py-2 mt-2 text-sm tracking-wider bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
//                 >
//               About
//                 </a>
//                 <a
//                   href="#"
//                   className="px-4 py-2 mt-2 text-sm tracking-wider bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
//                 >
//                  GIC
//                 </a>
//                 <a
//                   href="#"
//                   className="px-4 py-2 mt-2 text-sm tracking-wider bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
//                 >
//                 Blocked Accounts
//                 </a>
//                 <a
//                   href="#"
//                   className="px-4 py-2 mt-2 text-sm tracking-wider bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
//                 >
//               Forex
//                 </a>
//                 {/* <div className="relative">
//                   <button
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     className="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm tracking-wider text-gray-900 bg-gray-200 rounded-lg md:w-auto md:inline md:mt-0 md:ml-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none focus:shadow-outline"
//                   >
//                     <span>More</span>
//                     <svg
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                       className={`inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform ${
//                         isDropdownOpen ? 'rotate-180' : 'rotate-0'
//                       }`}
//                       >
//                       <path
//                         fillRule="evenodd"
//                         d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                         />
//                     </svg>
//                   </button>
                       
//                   {isDropdownOpen && (
//                     <div className="absolute right-0 w-full mt-2 origin-top-right md:max-w-screen-sm md:w-screen">
//                       <div className="px-2 pt-2 pb-4 bg-white rounded-md shadow-lg">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <a
//                             href="#"
//                             className="flex flex-row items-start p-2 rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
//                           >
//                             <div className="p-3 text-white bg-teal-500 rounded-lg">
//                               <svg
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 viewBox="0 0 24 24"
//                                 className="w-4 h-4"
//                               >
//                                 <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
//                               </svg>
//                             </div>
//                             <div className="ml-3">
//                               <p className="font-semibold">Appearance</p>
//                               <p className="text-sm">Easy customization</p>
//                             </div>
//                           </a>
//                           <a
//                             href="#"
//                             className="flex flex-row items-start p-2 rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
//                           >
//                             <div className="p-3 text-white bg-teal-500 rounded-lg">
//                               <svg
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 viewBox="0 0 24 24"
//                                 className="w-4 h-4"
//                               >
//                                 <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
//                               </svg>
//                             </div>
//                             <div className="ml-3">
//                               <p className="font-semibold">Comments</p>
//                               <p className="text-sm">
//                                 Check your latest comments
//                               </p>
//                             </div>
//                           </a>
//                           <a
//                             href="#"
//                             className="flex flex-row items-start p-2 rounded-lg hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
//                           >
//                             <div className="p-3 text-white bg-teal-500 rounded-lg">
//                               <svg
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth="2"
//                                 viewBox="0 0 24 24"
//                                 className="w-4 h-4"
//                               >
//                                 <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
//                                 <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
//                               </svg>
//                             </div>
//                             <div className="ml-3">
//                               <p className="font-semibold">Analytics</p>
//                               <p className="text-sm">
//                                 Take a look at your statistics
//                               </p>
//                             </div>
//                           </a>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div> */}
//                 <button className="flex px-5 mt-5 md:mt-0 py-2 md:py-0 items-center tracking-widest text-sm justify-center  uppercase border-[2px]  hover:text-white hover:bg-blue-600 cursor-pointer transition-all duration-300 hover:border-blue-600 ml-2" onClick={()=>(<Navigate to="/auth/login" replace/>)}>Login</button>
//                 <button className="flex px-5 mt-3 md:mt-0 py-2 md:py-0 items-center tracking-widest text-sm justify-center uppercase border-[2px]  cursor-pointer transition-all duration-300 bg-blue-600 text-white hover:bg-white hover:text-black  ml-2">Signup</button>
//               </nav>
//             </div>
//           </div>
//         </div>
     
//         <section className="relative h-[95rem] md:h-[42.6rem] bg-cover bg-center bg-no-repeat flex items-center justify-center">
//   <div
//     className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent brightness-[0.75] "
//     style={{
//       backgroundImage: `url(${hero})`,
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//     }}
//   ></div>

//   <div className="relative flex items-center justify-center h-full px-4">
//     <div className="text-center">
//       <h1 className="font-bold text-[2.5rem] text-white">Your Global Exposure Partner!</h1>
//       <button className="mt-4 ml-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
//         Learn More
//       </button>
//     </div>
//   </div>
// </section>


//     </>
//   );
// };

// export default Navbar;
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from '../../components/homeComponents/AppAppBar';
import Hero from '../../components/homeComponents/Hero';
import LogoCollection from '../../components/homeComponents/LogoCollection';
import Highlights from '../../components/homeComponents/Highlights';
import Pricing from '../../components/homeComponents/Pricing';
import Features from '../../components/homeComponents/Features';
import Testimonials from '../../components/homeComponents/Testimonials';
import FAQ from '../../components/homeComponents/FAQ';
import Footer from '../../components/homeComponents/Footer';
import AppTheme from '../../theme/shared-theme/AppTheme';
import Gic from '../../components/homeComponents/GIC';
import Box from '@mui/material/Box';
import BlockAccount from '../../components/homeComponents/BlockAccount'
import Forex from '../../components/homeComponents/Forex'
import OSHC from '../../components/homeComponents/OSHC'
import PaymentTagging from '../../components/homeComponents/PaymentTagging'
import FinanceSupport from '../../components/homeComponents/FinanceSupport'
export default function MarketingPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          fontFamily: 'poppins, sans-serif !important' , // Apply Poppins font-family
        }}
      >
        <AppAppBar />
        <Hero />
        <div>
          <LogoCollection />
          {/* <Divider /> */}
          <Features />
          {/* GIc */}
          <Divider />
          <Gic />
          <Divider />
          <BlockAccount/>
          <Divider />
          <Forex/>
          <Divider />
          <OSHC/>
          <Divider />
          <PaymentTagging/>
          <Divider />
          <FinanceSupport/>
          <Testimonials />
          <Divider />
          <Highlights />
          <Divider />
          {/* <Pricing /> */}
          <Divider />
          <FAQ />
          <Divider />
          <Footer />
        </div>
      </Box>
    </AppTheme>
  );
}

