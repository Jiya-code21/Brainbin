import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const AppContent = createContext();

export const AppContextProvider = (props) => {

axios.defaults.withCredentials=true


  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null); // ✅ fixed from `false`

  const getAuthState = async () => {
    try {
      axios.defaults.withCredentials = true; // ✅ include credentials
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
      if (data.success) {
        setIsLoggedin(true);
        getUserData(); // ✅ call after login state
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + '/api/user/data');
      console.log("Fetched userData:", data.userData); // ✅ for debug
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState(); // ✅ auto fetch on load
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
