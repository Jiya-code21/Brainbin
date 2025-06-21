import React, { useContext, useEffect } from 'react';
import { assets } from "../assets/assets";
import { useNavigate } from 'react-router-dom';
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const {
    userData,
    backendUrl,
    setUserData,
    setIsLoggedin,
    getUserData
  } = useContext(AppContent);

  useEffect(() => {
    if (userData === null) {
      getUserData();
    }
  }, []);

  const sendVerificationOtp = async () => {
    if (userData?.isAccountVerified) {
      toast.info("Your email is already verified.");
      return;
    }

    if (!userData || !userData._id) {
      toast.error("User ID not found. Please wait or re-login.");
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp', {
        userId: userData._id,
      });

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      {/*  Smaller Logo */}
<img src={assets.logo} alt="Logo" className='w-28 sm:w-36 bg-transparent !bg-none' />


      {userData ? (
<div className='w-12 h-12 flex justify-center items-center rounded-full bg-black text-white text-lg relative group'>

          {userData.name[0].toUpperCase()}

          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className='px-2 py-1 hover:bg-gray-200 cursor-pointer'>
                  Verify email
                </li>
              )}
              <li
                onClick={logout}
                className='px-2 py-1 hover:bg-gray-200 cursor-pointer'>
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>
          Login
          <img src={assets.arrow_icon} alt="arrow" />
        </button>
      )}
    </div>
  );
}

export default Navbar;
