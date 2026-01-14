import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { useToast, Spinner } from '@chakra-ui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaUser, FaEnvelope, FaBuilding, FaPhone, FaMapMarkerAlt, FaLock, FaFileUpload } from 'react-icons/fa';
// Simple Service Slider Component
const ServiceSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    { name: "GIC", type: "text" },
    { name: "Blocked Accounts", type: "text" },
    { name: "Forex", type: "text" },
    { name: "/Logo.png", type: "logo" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="relative h-full flex flex-col items-center justify-center px-8">
      {/* Main Display */}
      <div className="relative w-full max-w-lg">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          
          {/* Content Display */}
          <div className="text-center">
            {services[currentIndex].type === "text" ? (
              <div>
                <h2 className="text-5xl font-bold text-gray-800 mb-4">
                  {services[currentIndex].name}
                </h2>
                <div className="text-gray-500 text-lg">Financial Services</div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <img
                  src="/Logo.png"
                  alt="AbroCare Logo"
                  className="max-h-20 max-w-64 object-contain"
                  onError={(e) => {
                    console.log('Logo failed to load, trying fallback');
                    e.target.src = '/LogoWhite.png';
                  }}
                />
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
          <div className="absolute top-6 left-6 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 right-6 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          {services.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-8 shadow-lg' 
                  : 'bg-white/40 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-12 max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">
          Your Financial <br />
          <span className="text-yellow-300">Journey Starts Here</span>
        </h1>
        <p className="text-xl text-indigo-100 leading-relaxed mb-8">
          Comprehensive financial services for international students
        </p>
        
        {/* Feature Points */}
        <div className="space-y-4 text-indigo-100">
          <div className="flex items-center space-x-3 justify-center">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <span>Effortless GIC Account Management</span>
          </div>
          <div className="flex items-center space-x-3 justify-center">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <span>Trusted Blocked Account Services</span>
          </div>
          <div className="flex items-center space-x-3 justify-center">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <span>Secure Forex Solutions</span>
          </div>
          <div className="flex items-center space-x-3 justify-center">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <span>24/7 Professional Support</span>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">Fast</div>
            <div className="text-xs text-indigo-200">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">Secure</div>
            <div className="text-xs text-indigo-200">Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-300">Trusted</div>
            <div className="text-xs text-indigo-200">Platform</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [abroadReason, setAbroadReason] = useState('');
  const [document1, setDocument1] = useState(null);
  const [document2, setDocument2] = useState(null);
  const [businessDivision, setBusinessDivision] = useState('');

  // List of states for the dropdown
  const statesList = [
    { name: 'Andhra Pradesh' },
    { name: 'Arunachal Pradesh' },
    { name: 'Assam' },
    { name: 'Bihar' },
    { name: 'Chhattisgarh' },
    { name: 'Goa' },
    { name: 'Gujarat' },
    { name: 'Haryana' },
    { name: 'Himachal Pradesh' },
    { name: 'Jharkhand' },
    { name: 'Karnataka' },
    { name: 'Kerala' },
    { name: 'Maharashtra' },
    { name: 'Madhya Pradesh' },
    { name: 'Manipur' },
    { name: 'Meghalaya' },
    { name: 'Mizoram' },
    { name: 'Nagaland' },
    { name: 'Odisha' },
    { name: 'Punjab' },
    { name: 'Rajasthan' },
    { name: 'Sikkim' },
    { name: 'Tamil Nadu' },
    { name: 'Tripura' },
    { name: 'Telangana' },
    { name: 'Uttar Pradesh' },
    { name: 'Uttarakhand' },
    { name: 'West Bengal' },
    { name: 'Andaman & Nicobar (UT)' },
    { name: 'Chandigarh (UT)' },
    { name: 'Dadra & Nagar Haveli and Daman & Diu (UT)' },
    { name: 'Delhi [National Capital Territory (NCT)]' },
    { name: 'Jammu & Kashmir (UT)' },
    { name: 'Ladakh (UT)' },
    { name: 'Lakshadweep (UT)' },
    { name: 'Puducherry (UT)' },
  ];
  console.log('doc', document1);
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (
      !name ||
      !email ||
      !organization ||
      !phoneNumber ||
      !state ||
      !city ||
      !password ||
      !confirmPassword
    ) {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill out all required fields.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoading(false);
      return;
    }

    // Prepare FormData for file uploads
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('organization', organization);
    formData.append('phoneNumber', phoneNumber);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('password', password);
    // formData.append('abroadReason', abroadReason);
    formData.append('businessDivision', businessDivision);
    if (document1) formData.append('document1', document1.name);
    if (document2) formData.append('document2', document2.name);

    try {
      const response = await post(
        'https://abroad-backend-gray.vercel.app/auth/register',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      if (response.status === 200) {
        toast({
          title: 'Registration Successful',
          description: response.data.message,
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'bottom-right',
        });
        setLoading(false);
        navigate('/auth/login');
      }
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'An error occurred while registering. Please try again.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right',
      });
      setLoading(false);
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Service Slider */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700 overflow-hidden">
          {/* Decorative circles pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-16 right-12 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-8 h-8 border-2 border-white/15 rounded-full animate-bounce"></div>
            <div className="absolute bottom-20 left-12 w-20 h-20 border-2 border-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-40 left-24 w-6 h-6 border-2 border-white/25 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-8 w-4 h-4 border-2 border-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-3/4 right-16 w-12 h-12 border-2 border-white/20 rounded-full animate-pulse"></div>
          </div>

          {/* Service Slider Component */}
          <ServiceSlider />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white overflow-y-auto h-screen">
        <div className="mx-auto w-full max-w-lg py-8">
          <div>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                className="h-14 w-auto"
                src="/Logo.png"
                alt="Company Logo"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Join us and streamline your financial services journey
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Organization and Phone in a row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      placeholder="Organization"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setPhoneNumber(value);
                      }}
                      className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>

              {/* State and City in a row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    </div>
                    <select
                      id="state"
                      name="state"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    >
                      <option value="">Select State</option>
                      {statesList.map((stateItem, index) => (
                        <option key={index} value={stateItem.name}>
                          {stateItem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      placeholder="Enter city"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      placeholder="Password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <HiEyeOff className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      placeholder="Confirm password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <HiEyeOff className="h-4 w-4" /> : <HiEye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Division */}
              <div>
                <label htmlFor="businessDivision" className="block text-sm font-medium text-gray-700">
                  Business Division
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    id="businessDivision"
                    name="businessDivision"
                    required
                    value={businessDivision}
                    onChange={(e) => setBusinessDivision(e.target.value)}
                    className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  >
                    <option value="">Select Business Division</option>
                    <option value="GIC">GIC</option>
                    <option value="FOREX">FOREX</option>
                  </select>
                </div>
              </div>

              {/* Document Upload Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="document1" className="block text-sm font-medium text-gray-700">
                    Document 1
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFileUpload className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="document1"
                      name="document1"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setDocument1(file);
                          toast({
                            title: 'File Selected',
                            description: `Selected: ${file.name}`,
                            status: 'info',
                            duration: 2000,
                            isClosable: true,
                          });
                        }
                      }}
                      className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="document2" className="block text-sm font-medium text-gray-700">
                    Document 2
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFileUpload className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="document2"
                      name="document2"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setDocument2(file);
                          toast({
                            title: 'File Selected',
                            description: `Selected: ${file.name}`,
                            status: 'info',
                            duration: 2000,
                            isClosable: true,
                          });
                        }
                      }}
                      className="appearance-none block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out transform hover:scale-105"
                >
                  {loading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <FaUser className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" />
                      </span>
                      Create Account
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 space-y-3">
                <div>
                  <Link
                    to="/"
                    className="text-sm text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/auth/login"
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                    >
                      Sign in here
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}