import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { Button, useToast } from '@chakra-ui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import registerimg from '../../../assets/img/auth/register.png';
import { Spinner } from '@chakra-ui/react';

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
        'https://abroad-backend-gray.vercel.app//auth/register',
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg md:shadow-lg overflow-hidden h-[655px]">
        <div className="hidden md:flex items-center justify-center bg-blue-100 p-6">
          <img
            src={registerimg}
            alt="Person registering"
            className="w-[30vw] h-auto"
          />
        </div>
        <div className="p-10 flex flex-col justify-center w-[450px] overflow-y-auto pt-[650px]">
          <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
          <p className="text-sm text-gray-600 mb-6">Create your account.</p>

          <form onSubmit={handleSubmit}>
            {/* Existing fields */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-semibold"
              >
                Name
              </label>
              <input
                type="text"
                id="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold"
              >
                Email
              </label>
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
              <label
                htmlFor="organization"
                className="block text-gray-700 font-semibold"
              >
                Organization
              </label>
              <input
                type="text"
                id="organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Enter your organization"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 font-semibold"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                  setPhoneNumber(value);
                }}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                pattern="[0-9]*" // Allow only numbers on mobile devices
                inputMode="numeric" // Show numeric keyboard on mobile
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="state"
                className="block text-gray-700 font-semibold"
              >
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your state</option>
                {statesList.map((stateItem, index) => (
                  <option key={index} value={stateItem.name}>
                    {stateItem.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="city"
                className="block text-gray-700 font-semibold"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold"
              >
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="absolute right-3 top-[45px] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
            <div className="mb-4 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-semibold"
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="absolute right-3 top-[45px] cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
            {/* ... */}

            {/* <div className="mb-4">
              <label
                htmlFor="abroadReason"
                className="block text-gray-700 font-semibold"
              >
                Why do you want to be a part of abroad?
              </label>
              <input
                type="text"
                id="abroadReason"
                value={abroadReason}
                onChange={(e) => setAbroadReason(e.target.value)}
                placeholder="Explain your reason"
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}

            <div className="mb-4">
              <label
                htmlFor="document1"
                className="block text-gray-700 font-semibold"
              >
                Document 1 (Document Verified?)
              </label>
              <input
                type="file"
                id="document1"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setDocument1(file);
                    toast({
                      title: 'File Selected',
                      description: `Selected file: ${file.name}`,
                      status: 'info',
                      duration: 2000,
                      isClosable: true,
                      position: 'bottom-right',
                    });
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="document2"
                className="block text-gray-700 font-semibold"
              >
                Document 2 (Document Verified?)
              </label>
              <input
                type="file"
                id="document2"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setDocument2(file);
                    toast({
                      title: 'File Selected',
                      description: `Selected file: ${file.name}`,
                      status: 'info',
                      duration: 2000,
                      isClosable: true,
                      position: 'bottom-right',
                    });
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="businessDivision"
                className="block text-gray-700 font-semibold"
              >
                Business Division
              </label>
              <select
                id="businessDivision"
                value={businessDivision}
                onChange={(e) => setBusinessDivision(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Business Division</option>
                <option value="GIC">GIC</option>
                <option value="FOREX">FOREX</option>
              </select>
            </div>

            {loading ? (
             <div className='text-center'>
               <Spinner />
             </div>
            ) : (
              <Button type="submit" colorScheme="blue" className="w-full mt-4">
                Register
              </Button>
            )}
          </form>
          <p className="text-[16px] mx-auto pb-4 text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}