import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; 
import { AppContent } from "../context/AppContext";

const { header_img, hand_wave, demoVideo } = assets;

function Header() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      @keyframes shine {
        100% { left: 125%; }
      }
      .button-shine {
        position: relative;
        overflow: hidden;
      }
      .button-shine::after {
        content: '';
        position: absolute;
        top: 0;
        left: -75%;
        width: 50%;
        height: 100%;
        background: linear-gradient(
          120deg,
          rgba(255, 255, 255, 0.2),
          rgba(255, 255, 255, 0.5),
          rgba(255, 255, 255, 0.2)
        );
        transform: skewX(-25deg);
        animation: shine 2s infinite;
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
    <div className="relative w-full overflow-hidden min-h-screen flex justify-center items-center px-4 sm:px-8 py-16 bg-white text-gray-800">

      {/* Glowing Purple Blob */}
      <div className="absolute w-[400px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-0 -left-20 z-0"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl mx-auto gap-12">
        
        {/* Left Side: Text + CTA */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-base sm:text-xl font-medium text-gray-800 mb-2">
            Hey {userData ? userData.name : 'Developer'}
            <img src={hand_wave} alt="wave" className="w-6 animate-wave" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Brain Bin
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6 max-w-md">
            See your knowledge flow in motion. Add, organize, and share visually.
          </p>
          <button
            onClick={() => {
              if (userData) {
                navigate("/notes");
              } else {
                setShowLoginModal(true);
              }
            }}
            className="button-shine bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl hover:scale-105 transition-all"
          >
            Organize Now 🚀
          </button>
        </div>

        {/* Right Side: Video */}
        <div className="flex-1">
          <video
            src={demoVideo}
            controls
            muted
            className="w-full rounded-2xl shadow-xl border border-gray-200"
          />
        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50"
             style={{
               backgroundColor: "rgba(0,0,0,0.4)",
               backdropFilter: "blur(6px)",
               WebkitBackdropFilter: "blur(6px)",
             }}>
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Kindly log in to continue</h2>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate("/login", { state: { from: "/notes" } });
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg transition"
              >
                Login Now
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Header;
