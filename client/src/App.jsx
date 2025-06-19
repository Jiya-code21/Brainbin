import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Notes from "./pages/Notes";
import Error from "./pages/error";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 👈 must import for styling

function App() {
  return (
    <div>
      {/* ✅ Toast container with bottom-center position */}
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // or "light" if you prefer
      />

      {/* App Routes */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/notes" element={<Notes />} />

        {/* 404 Fallback */}
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
