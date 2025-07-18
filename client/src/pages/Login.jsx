import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const { backendUrl, getUserData } = useContext(AppContent);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios.defaults.withCredentials = true;

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', {
          name,
          email,
          password,
        });

        if (data.success) {
          await getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password,
        });

        if (data.success) {
          await getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 relative">
      {/* 🔄 Stylish spinner CSS inside <style> */}
      <style>
        {`
          .loader-btn {
            display: inline-block;
            width: 22px;
            height: 22px;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            border-top-color: white;
            border-left-color: white;
            animation: spin 0.6s ease-in-out infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === 'Sign Up' ? 'Create account' : 'Login to your account!'}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === 'Sign Up' ? 'Create your account' : 'Welcome back! Please login.'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent outline-none text-white w-full"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent outline-none text-white w-full"
              type="email"
              placeholder="Email id "
              required
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent outline-none text-white w-full"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className="mb-4 text-indigo-500 cursor-pointer"
          >
            Forgot password?
          </p>

          {/* ✅ Login/Signup Button with Attractive Spinner */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-full flex justify-center items-center font-medium text-white transition ${
              loading
                ? 'bg-indigo-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-indigo-900 hover:opacity-90'
            }`}
          >
            {loading ? <div className="loader-btn"></div> : state}
          </button>
        </form>

        <p className="text-gray-400 text-center text-xs mt-4">
          {state === 'Sign Up'
            ? 'Already have an account? '
            : "Don't have an account? "}
          <span
            onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
            className="text-blue-400 cursor-pointer underline"
          >
            {state === 'Sign Up' ? 'Login here' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

