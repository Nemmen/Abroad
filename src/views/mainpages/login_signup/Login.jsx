import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { useToast, Spinner } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaUser, FaLock } from 'react-icons/fa';



export default function Login() {
  const user = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  // Initialize the toast
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = await post('https://abroad-backend-gray.vercel.app/auth/login', {
        email,
        password,
      });

      const response = request.data;

      if (request.status === 200) {
        localStorage.setItem('token_auth', response.token);
        localStorage.setItem('user_role', response.user.role);
        setLoading(false);

        // Navigate based on user role
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else if (response.user.role === 'user') {
          navigate('/agent');
        }

        // Show success toast
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'bottom-right',
          containerStyle: {
            width: '400px',
          },
        });
        if (response.status === 401) {
          toast({
            title: 'Login Failed',
            description: response.user.message,
            status: 'error',
            duration: 1000,
            isClosable: true,
            position: 'bottom-right',
            containerStyle: {
              width: '400px',
            },
          });
          setLoading(false);
        }

        dispatch(SetUser(response.user));
      }
    } catch (error) {
      // Show error toast
      setLoading(false);
      toast({
        title: 'Login Failed',
        description: error.response.data.message,
        status:
          error.response.data.message === 'Invalid credentials'
            ? 'error'
            : 'warning',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
        containerStyle: {
          width: '400px',
        },
      });
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                className="h-14 w-auto"
                src="/Logo.png"
                alt="Company Logo"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 text-center">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Access your financial services dashboard
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <HiEyeOff className="h-5 w-5" />
                      ) : (
                        <HiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/auth/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out transform hover:scale-105"
                >
                  {loading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <FaLock className="h-5 w-5 text-blue-300 group-hover:text-blue-200" />
                      </span>
                      Sign in
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/auth/signup"
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                  >
                    Sign up now
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Background with Illustration */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 overflow-hidden">
          {/* Decorative circles pattern */}
          <div className="absolute inset-0">
            {/* Background circles */}
            <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-16 left-20 w-8 h-8 border-2 border-white/15 rounded-full"></div>
            <div className="absolute top-32 left-12 w-12 h-12 border-2 border-white/10 rounded-full"></div>
            <div className="absolute top-48 left-24 w-6 h-6 border-2 border-white/20 rounded-full"></div>
            
            <div className="absolute bottom-8 right-8 w-20 h-20 border-2 border-white/15 rounded-full"></div>
            <div className="absolute bottom-16 right-20 w-10 h-10 border-2 border-white/20 rounded-full"></div>
            <div className="absolute bottom-32 right-12 w-14 h-14 border-2 border-white/10 rounded-full"></div>
            <div className="absolute bottom-48 right-24 w-8 h-8 border-2 border-white/25 rounded-full"></div>
            
            {/* Side circles */}
            <div className="absolute top-64 left-4 w-12 h-12 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-80 left-8 w-6 h-6 border-2 border-white/15 rounded-full"></div>
            <div className="absolute top-96 left-2 w-8 h-8 border-2 border-white/10 rounded-full"></div>
          </div>

          {/* Main content area */}
          <div className="relative h-full flex items-center justify-center px-12">
            <div className="text-center max-w-md">
              
              {/* Central illustration area */}
              <div className="relative mb-8">
                {/* Main chart/dashboard card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl mx-auto w-64 h-48 relative">
                  {/* Chart bars */}
                  <div className="flex items-end justify-between h-32 mb-4">
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-8 h-16 rounded-t"></div>
                    <div className="bg-gradient-to-t from-indigo-500 to-indigo-400 w-8 h-24 rounded-t"></div>
                    <div className="bg-gradient-to-t from-purple-500 to-purple-400 w-8 h-20 rounded-t"></div>
                    <div className="bg-gradient-to-t from-blue-500 to-blue-400 w-8 h-28 rounded-t"></div>
                    <div className="bg-gradient-to-t from-indigo-500 to-indigo-400 w-8 h-18 rounded-t"></div>
                    <div className="bg-gradient-to-t from-purple-500 to-purple-400 w-8 h-22 rounded-t"></div>
                  </div>
                  
                  {/* Chart title */}
                  <div className="text-gray-700 text-sm font-medium">Financial Portfolio</div>
                  <div className="text-gray-500 text-xs">Monthly Analytics</div>
                </div>

                {/* Floating user avatars */}
                {/* Top left avatar */}
                <div className="absolute -top-4 -left-8 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="text-orange-500 text-lg" />
                  </div>
                </div>

                {/* Top right avatar */}
                <div className="absolute -top-8 -right-4 w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="text-green-500" />
                  </div>
                </div>

                {/* Bottom right avatar */}
                <div className="absolute -bottom-6 -right-8 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                    <FaUser className="text-purple-500 text-sm" />
                  </div>
                </div>

                {/* Decorative stars */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-yellow-200 rounded-full animate-ping"></div>
                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-8">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/80 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>

              {/* Text content */}
              <h1 className="text-4xl font-bold text-white mb-6">
                Your Financial <br />
                <span className="text-yellow-300">Services Hub</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Manage GIC, Blocked Accounts, and Forex services seamlessly in one secure platform
              </p>

              {/* Feature points */}
              <div className="space-y-4 text-blue-100">
                <div className="flex items-center space-x-3 justify-center">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Real-time transaction tracking</span>
                </div>
                <div className="flex items-center space-x-3 justify-center">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Secure financial operations</span>
                </div>
                <div className="flex items-center space-x-3 justify-center">
                  <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <span>Trusted banking partnerships</span>
                </div>
              </div>

              {/* Bottom quote */}
              <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <p className="text-blue-100 italic text-sm">
                  "Fast. Easy. Reliable. - Your trusted solution for all financial services needs."
                </p>
                <div className="flex items-center justify-center mt-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-xs" />
                  </div>
                  <div className="ml-2 text-blue-200 text-xs">
                    <div className="font-medium">Trusted Platform</div>
                    <div className="text-blue-300">Financial Services</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}