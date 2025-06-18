import React from 'react';

const Error = () => {
  return (
    <div className="h-screen w-screen bg-white flex flex-col items-center justify-center px-4 text-center relative">

      {/* Robot Emoji (without circle) */}
      <div className="text-7xl mb-4 animate-bounce">🤖</div>

      {/* 404 Message */}
      <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
        404
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto mb-6">
        This page seems to be lost in space. Don't worry, let's help you get back on track!
      </p>

      {/* Back to Home Button */}
      <a
        href="/"
        className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transform transition duration-300"
      >
        👈 Back to Home

      </a>

    
    </div>
  );
};

export default Error;
