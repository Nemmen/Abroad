import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { Button, useToast } from "@chakra-ui/react"; // Import useToast from Chakra UI
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import loginimg from '../../../assets/img/auth/login.png';
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Import eye icons from react-icons

export default function Login() {
  const user = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();
  
  // Initialize the toast
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post('http://localhost:4000/auth/login', { email, password });
      const response = request.data;

      if (request.status === 200) {
        localStorage.setItem('token_auth', response.token);
        localStorage.setItem('user_role', response.user.role);
        
        // Navigate based on user role
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else if (response.user.role === 'user') {
          navigate('/agent');
        }
        

        // Show success toast
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "bottom-right",
          containerStyle: {
            width: "400px", 
          },
        });
        if(response.status===401){
          toast({
            title: "Login Failed",
            description: response.user.message,
            status: "error",
            duration: 1000,
            isClosable: true,
            position: "bottom-right",
            containerStyle: {
              width: "400px", 
            },
          });
        }

        dispatch(SetUser(response.user));
      }
    } catch (error) {
      // Show error toast
      
      toast({
        title: "Login Failed",
        description: error.response.data.message,
        status: error.response.data.message=="Invalid credentials" ? "error" : "warning",
        duration: 1000,
        isClosable: true,
        position: "bottom-right",
        containerStyle: {
          width: "400px", 
        },
      });
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl h-[655px]">
        <div className="w-1/2 bg-blue-100 flex justify-center items-center">
          <img src={loginimg} alt="Person on laptop" className="w-[40vw] h-auto" />
        </div>
        <div className="p-12 flex flex-col justify-center w-[450px]">
          <h2 className="text-2xl font-semibold text-gray-800">Sign In</h2>
          <p className="text-sm text-gray-600 mb-6">Unlock your world.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800">Password</label>
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type based on state
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
              />
              <span
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute right-3 top-9 cursor-pointer"
              >
                {showPassword ? <HiEyeOff className="text-gray-600" /> : <HiEye className="text-gray-600" />}
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Sign In
            </button>
          </form>
          <div className='mt-5'>
            <p className='text-sm text-center text-black'>Don't have an account?</p>
            <Link to="/auth/signup" className="block text-center text-blue-600 hover:underline">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
