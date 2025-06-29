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
    if (userData === null) getUserData();
  }, []);

  const sendVerificationOtp = async () => {
    if (userData?.isAccountVerified) return toast.info("Your email is already verified.");
    if (!userData?._id) return toast.error("User ID not found. Please wait or re‑login.");

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {
        userId: userData._id,
      });

      data.success
        ? (navigate('/email-verify'), toast.success(data.message))
        : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='w-full flex justify-between items-center py-2 px-4 sm:px-10 fixed top-0 left-0 z-50 bg-white shadow-md'>

      {/* Logo */}
      <img src={assets.logo} alt="Logo" className='w-20 sm:w-28 bg-transparent' />

      {/* Right side */}
      {userData ? (
        <div className="relative group">
          {/* Avatar Circle */}
          <div className='w-10 h-10 sm:w-11 sm:h-11 flex justify-center items-center rounded-full bg-black text-white text-lg cursor-pointer'>
            {userData.name[0].toUpperCase()}
          </div>

          {/* Dropdown Menu */}
          <div className='absolute top-[110%] right-0 hidden group-hover:flex flex-col bg-white rounded shadow-lg border text-sm min-w-[140px] overflow-hidden'>
            {!userData.isAccountVerified && (
              <button
                onClick={sendVerificationOtp}
                className='px-4 py-2 text-left hover:bg-gray-100 w-full'>
                📩 Verify Email
              </button>
            )}
            <button
              onClick={logout}
              className='px-4 py-2 text-left hover:bg-gray-100 w-full'>
              🚪 Logout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border border-gray-500 rounded-full px-5 py-1.5 text-gray-800 hover:bg-gray-100 transition'>
          Login
          <img src={assets.arrow_icon} alt="arrow" />
        </button>
      )}
    </div>
  );
}

export default Navbar;
