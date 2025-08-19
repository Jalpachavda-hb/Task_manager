import React, { useEffect, useState } from "react";
import axiosinstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";
const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New state to track loading

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosinstance.get(API_PATHS.AUTH.GET_PROFILE); // replace GET_PROFILE with your actual path
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Save token
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };


  return (
    <UserContext.Provider value={{ user,loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
export default UserProvider;
