import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import loginimg from '../../../assets/img/auth/login.png';

export default function Login() {
  const user = useSelector((state) => state.Auth);
  console.log(user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const request = await post('http://localhost:4000/auth/login', { email, password });
      const response = request.data;

      if (request.status === 200) {
        localStorage.setItem('token_auth', response.token);
        localStorage.setItem('user_role', response.user.role);
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else if (response.user.role === 'user') {
          navigate('/agent');
        }
        toast.success(response.message);
        dispatch(SetUser(response.user));
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl h-[655px]">
        <div className="w-1/2 bg-blue-100 flex justify-center items-center">
          <img src={loginimg} alt="Person on laptop" className="w-[40vw] h-auto" />
        </div>
        <div className=" p-12 flex flex-col justify-center  w-[450px]">
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
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 mt-1"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Sign In
            </button>
          </form>
          <Link to="/auth/signup" className="block text-center text-blue-600 hover:underline mt-6">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
