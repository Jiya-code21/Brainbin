import React, { useContext, useEffect } from 'react';
import { assets } from "../assets/assets";
import { AppContent } from "../context/AppContext";

function Header() {
  const { userData } = useContext(AppContent);

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

      @keyframes blink {
        50% { border-color: transparent }
      }

      .typing-text {
  overflow: hidden;
  white-space: nowrap;
  width: 0;
  animation: typing 3s steps(30, end) forwards;
  color: #1f2937;
}


      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .card-quote {
        animation: fadeUp 1.5s ease-out;
        background: linear-gradient(135deg, #e0f7fa, #fefefe);
        padding: 16px 24px;
        border-radius: 16px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        font-style: italic;
        color: #374151; /* Tailwind gray-700 */
        max-width: 420px;
        font-size: 15px;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>

      {/* ✅ Spinning profile image */}
      <img
        src={assets.header_img}
        alt="profile"
        className='w-36 h-36 rounded-full mb-6 animate-spin-slow'
      />

      {/* ✅ Animated wave */}
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 text-gray-800'>
        Hey {userData ? userData.name : 'Developer'}
        <img
          src={assets.hand_wave}
          alt="wave"
          className='w-8 aspect-square animate-wave'
        />
      </h1>

      {/* ✅ Typing welcome text */}
      <h2 className='text-3xl sm:text-5xl font-semibold mb-4 typing-text'>
        Welcome to Brain bin
      </h2>

      <p className='mb-8 max-w-md text-gray-600'>
        Let's start with a quick product tour and we will have you up and running in no time!
      </p>

      {/* ✨ Animated quote card */}
      <div className="card-quote">
        “Small steps every day lead to big results. Let’s organize your digital brain.”
      </div>
    </div>
  );
}

export default Header;
