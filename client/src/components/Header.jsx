import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";

function Header() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin-slow {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      } 
      .animate-spin-slow {
        animation: spin-slow 10s linear infinite;
        transform-style: preserve-3d;
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      }

      @keyframes wave {
        0% { transform: rotate(0deg); }
        10% { transform: rotate(14deg); }
        20% { transform: rotate(-8deg); }
        30% { transform: rotate(14deg); }
        40% { transform: rotate(-4deg); }
        50% { transform: rotate(10deg); }
        60% { transform: rotate(0deg); }
        100% { transform: rotate(0deg); }
      }
      .animate-wave {
        display: inline-block;
        transform-origin: bottom right;
        animation: wave 2s infinite;
      }

      @keyframes typing {
        from { width: 0 }
        to { width: 100% }
      }
      .typing-text {
        overflow: hidden;
        white-space: nowrap;
        width: 0;
        animation: typing 3s steps(30, end) forwards;
        color: #1f2937;
      }

      @keyframes spinnerRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .multi-color-spinner {
        width: 64px;
        height: 64px;
        border: 6px solid transparent;
        border-top-color: #06b6d4;   /* cyan */
        border-right-color: #3b82f6; /* blue */
        border-bottom-color: #8b5cf6; /* violet */
        border-left-color: #facc15;  /* yellow */
        border-radius: 50%;
        animation: spinnerRotate 1s linear infinite;
      }
    `;
    document.head.appendChild(style);

    // Fake loading delay removed: simulate real load
    const timer = setTimeout(() => setLoading(false), 800); // faster
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-white">
        <div className="multi-color-spinner"></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img
        src={assets.header_img}
        alt="profile"
        className='w-36 h-36 rounded-full mb-6 animate-spin-slow'
      />

      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 text-gray-800'>
        Hey {userData ? userData.name : 'Developer'}
        <img
          src={assets.hand_wave}
          alt="wave"
          className='w-8 aspect-square animate-wave'
        />
      </h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4 typing-text'>
        Welcome to Brain bin
      </h2>

      <p className='mb-8 max-w-md text-gray-600'>
        Let's start with a quick product tour and we will have you up and running in no time!
      </p>

      <button
        onClick={() => navigate("/notes")}
        className="bg-gradient-to-r from-teal-400 via-sky-500 to-violet-600 hover:from-teal-500 hover:via-sky-600 hover:to-violet-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-violet-400/60 transition-all duration-500 ease-in-out transform hover:scale-105 flex items-center gap-2"
      >
        Organize Now ➕🗂️
      </button>
    </div>
  );
}

export default Header;
