import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Notes from "./pages/Notes";
import Error from "./pages/error"; 
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path="/notes" element={<Notes />} />

        {/* ✅ Add 404 route at the end */}
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
