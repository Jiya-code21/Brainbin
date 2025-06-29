import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";

const { header_img, hand_wave, demoVideo } = assets;

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
        border-top-color: #06b6d4;
        border-right-color: #3b82f6;
        border-bottom-color: #8b5cf6;
        border-left-color: #facc15;
        border-radius: 50%;
        animation: spinnerRotate 1s linear infinite;
      }
    `;
    document.head.appendChild(style);

    const timer = setTimeout(() => setLoading(false), 800);
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
    <div className="relative flex flex-col items-center justify-center min-h-screen px-2 sm:px-4 text-center text-gray-800 bg-white overflow-hidden pt-14">

      {/* Avatar */}
      <img
        src={header_img}
        alt="profile"
        className='w-20 h-20 sm:w-28 sm:h-28 rounded-full mb-3 animate-spin-slow shadow-xl'
      />

      {/* Welcome Text */}
      <h1 className='flex items-center gap-2 text-base sm:text-xl font-medium mb-1 text-gray-800'>
        Hey {userData ? userData.name : 'Developer'}
        <img
          src={hand_wave}
          alt="wave"
          className='w-5 sm:w-6 aspect-square animate-wave'
        />
      </h1>

      {/* Heading */}
      <h2 className='text-xl sm:text-3xl font-semibold mb-2 typing-text'>
        Welcome to Brain Bin
      </h2>

      {/* Sub Text */}
      <p className='mb-4 max-w-xs sm:max-w-md text-gray-700 text-sm font-medium'>
        See your knowledge flow in motion. Add, organize, and share visually.
      </p>

      {/* Cliply-Style Video Section */}
      <div className="p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl shadow-2xl max-w-4xl w-full mb-8">
        <div className="bg-[#1e1e2f] rounded-2xl overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-[#2c2c3b]">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white text-sm ml-4">brainbin</span>
          </div>
          <video
            src={demoVideo}
            controls
            playsInline
            muted={false}
            className="w-full aspect-video object-cover"
          />
        </div>
      </div>

      {/* Organize Button with spacing */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/notes")}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-indigo-600 hover:scale-105 transition-all duration-300 text-white font-semibold px-5 py-2 sm:px-6 sm:py-3 rounded-full shadow-md text-sm sm:text-base"
        >
          <span>Organize Now</span> <span>🗂</span>
        </button>
      </div>
    </div>
  );
}

export default Header;
