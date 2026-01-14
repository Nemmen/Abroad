import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { useToast, Spinner } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaUser, FaLock } from 'react-icons/fa';

// Animated Logo Background Component
const AnimatedLogoBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Import logos from LogoCollection (using require for dynamic imports)
  const logos = [
    { 
      src: require('../../../assets/img/home/flywireLogo.png'), 
      alt: "Flywire Logo", 
      category: "Forex" 
    },
    { 
      src: require('../../../assets/img/home/cibcLogo.png'), 
      alt: "CIBC Logo", 
      category: "Banking" 
    },
    { 
      src: require('../../../assets/img/home/iciciBankLogo.png'), 
      alt: "ICICI Bank Logo", 
      category: "GIC" 
    },
    { 
      src: require('../../../assets/img/home/rbcLogo.png'), 
      alt: "RBC Bank Logo", 
      category: "GIC" 
    },
    { 
      src: require('../../../assets/img/home/fintibaLogo.png'), 
      alt: "Fintiba Logo", 
      category: "Blocked Account" 
    },
    { 
      src: require('../../../assets/img/home/expartioLogo.png'), 
      alt: "Expatrio Logo", 
      category: "Blocked Account" 
    },
    { 
      src: require('../../../assets/img/home/convera.png'), 
      alt: "Convera Logo", 
      category: "Forex" 
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 border-2 border-white/15 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-24 w-20 h-20 border-2 border-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-48 right-16 w-8 h-8 border-2 border-white/25 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-12 w-6 h-6 border-2 border-white/30 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-28 w-4 h-4 border-2 border-white/20 rounded-full animate-pulse"></div>
      </div>

      {/* Main content container */}
      <div className="relative h-full flex flex-col items-center justify-center px-8 py-16">
        <div className="text-center max-w-2xl">
          
          {/* Logo Section */}
          <div className="mb-8">
            <div className="relative inline-block">
              {/* Single logo container with proper bounds */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl w-72 h-40 flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    key={currentIndex}
                    src={logos[currentIndex].src}
                    alt={logos[currentIndex].alt}
                    className="max-h-24 max-w-60 object-contain transition-all duration-700 ease-in-out transform"
                    style={{
                      animation: 'fadeInScale 2.5s ease-in-out infinite'
                    }}
                  />
                </div>
                
                {/* Category badge */}
                <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {logos[currentIndex].category}
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -top-2 -right-4 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute -bottom-3 -left-4 w-7 h-7 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -bottom-2 -right-3 w-5 h-5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-pulse shadow-lg"></div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              {logos.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-yellow-300 w-8' 
                      : 'bg-white/40 w-2'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Text content */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Trusted <span className="text-yellow-300">Partners</span>
          </h1>
          
          <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-lg mx-auto">
            Connect with leading financial institutions for secure GIC, Blocked Account, and Forex services
          </p>

          {/* Service highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-xl font-bold text-white">Secure</div>
              <div className="text-blue-200 text-sm">Transactions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-xl font-bold text-white">24/7</div>
              <div className="text-blue-200 text-sm">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for logo animation */}
      <style jsx>{`
        @keyframes fadeInScale {
          0%, 20% {
            opacity: 1;
            transform: scale(1);
          }
          80%, 100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};



export default function Login() {
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

              <div className="text-center space-y-3">
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
                    Don't have an account?{' '}
                    <Link
                      to="/auth/signup"
                      className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out"
                    >
                      Sign up now
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Animated Logo Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <AnimatedLogoBackground />
      </div>
    </div>
  );
}