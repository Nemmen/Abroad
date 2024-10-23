import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { Button, useToast } from "@chakra-ui/react"; // Import useToast from Chakra UI
import { HiEye, HiEyeOff } from 'react-icons/hi'; // Import eye icons from react-icons
import registerimg from '../../../assets/img/auth/register.png'; 

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  // Initialize the toast
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "bottom-right",
        containerStyle: {
          width: "400px", 
        },
      });
      return;
    }

    try {
      const request = await post('http://localhost:4000/auth/register', { 
        name, email, password, organization 
      });
      const response = request.data;

      if (request.status === 200) {
        toast({
          title: "Registration Successful",
          description: response.message, // Assuming the response contains a success message
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "bottom-right",
          containerStyle: {
            width: "400px", 
          },
        });
        navigate('/auth/login');
      }
      console.log(response);
    } catch (error) {
      // Show error toast
      toast({
        title: "Registration Failed",
        description: "An error occurred while registering. Please try again.",
        status: "error",
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden h-[655px]">
        <div className="flex items-center justify-center bg-blue-100 p-6">
          <img src={registerimg} alt="Person registering" className="w-[30vw] h-auto" />
        </div>
        <div className="p-10 flex flex-col justify-center w-[450px]">
          <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
          <p className="text-sm text-gray-600 mb-6">Create your account.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-semibold">Username</label>
              <input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="organization" className="block text-gray-700 font-semibold">Organization</label>
              <input
                type="text"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter your organization"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-gray-700 font-semibold">Password</label>
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type for password visibility
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute right-3 top-11 cursor-pointer"
              >
                {showPassword ? <HiEyeOff className="text-gray-600" /> : <HiEye className="text-gray-600" />}
              </span>
            </div>
            <div className="mb-6 relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'} // Toggle input type for confirm password visibility
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
                className="absolute right-3 top-11 cursor-pointer"
              >
                {showConfirmPassword ? <HiEyeOff className="text-gray-600" /> : <HiEye className="text-gray-600" />}
              </span>
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">Register</button>
          </form>

          <p className="flex justify-center items-center mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
