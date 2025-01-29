import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { Button, useToast, Spinner } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import loginimg from '../../../assets/img/auth/login.png';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import axios from 'axios';

export default function Login() {
  const user = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = await post(
        'http://127.0.0.1:4000/auth/login',
        { email, password },
        { credentials: 'include' }
      );
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

        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
          status: 'success',
          duration: 1000,
          isClosable: true,
          position: 'bottom-right',
          containerStyle: { width: '400px' },
        });

        dispatch(SetUser(response.user));
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Login Failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
        containerStyle: { width: '400px' },
      });
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:4000/auth/sendResetOtp', { email: forgotEmail });
      setLoading(false);
      setForgotModalOpen(false);
      setOtpModalOpen(true);
      toast({
        title: 'OTP Sent',
        description: 'Check your email for the OTP.',
        status: 'success',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to send OTP',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  const handleOtpVerification = async () => {
    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:4000/auth/sendResetOtp', { email: forgotEmail, otp });
      setLoading(false);
      setOtpModalOpen(false);
      setPasswordModalOpen(true);
      toast({
        title: 'OTP Verified',
        description: 'You can now reset your password.',
        status: 'success',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Invalid OTP',
        description: error.response?.data?.message || 'Please try again.',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
      });
      return;
    }
    try {
      setLoading(true);
      await axios.post('http://127.0.0.1:4000/auth/resetPassword', { email: forgotEmail, newPassword });
      setLoading(false);
      setPasswordModalOpen(false);
      toast({
        title: 'Password Reset Successful',
        description: 'You can now log in with your new password.',
        status: 'success',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to reset password',
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl h-[655px]">
        <div className="w-1/2 bg-blue-100 flex justify-center items-center">
          <img src={loginimg} alt="Person on laptop" className="w-[40vw] h-auto" />
        </div>
        <div className="p-10 flex flex-col justify-center w-[450px]">
          <h2 className="text-2xl font-semibold text-gray-800">Sign In</h2>
          <p className="text-sm text-gray-600 mb-6">Unlock your world.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
              />
            </div>
            <div className="mb-5 relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer"
              >
                {showPassword ? <HiEyeOff className="text-gray-600" /> : <HiEye className="text-gray-600" />}
              </span>
            </div>
            <div className="flex justify-end mb-4 hover:cursor-pointer group">
              <p onClick={() => setForgotModalOpen(true)} className="text-blue-600 group-hover:underline">Forgot Password?</p>
            </div>
            {loading ? (
              <div className="text-center">
                <Spinner size="lg" color="blue.500" />
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Sign In
              </button>
            )}
          </form>
          <p className="text-center text-slate-500 text-[16px] mx-auto flex pt-3">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="block text-center text-blue-600 hover:underline ml-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Forgot Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button onClick={handleForgotPassword} className="btn btn-primary">Send OTP</button>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter OTP</h3>
            <input
              type="text"
              maxLength="4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button onClick={handleOtpVerification} className="btn btn-primary">Verify OTP</button>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {isPasswordModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
            <button onClick={handlePasswordReset} className="btn btn-primary">Reset Password</button>
          </div>
        </div>
      )}
    </div>
  );
}
