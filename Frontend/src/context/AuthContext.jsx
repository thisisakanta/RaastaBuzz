import axios from "axios";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const savedUser = localStorage.getItem("raastabuzz_user");
  //   const savedToken = localStorage.getItem("raastabuzz_token");
  //   if (
  //     savedUser &&
  //     savedUser !== "undefined" &&
  //     savedToken &&
  //     savedToken !== "undefined"
  //   ) {
  //     setUser(JSON.parse(savedUser));
  //     setToken(savedToken);
  //   }
  //   setLoading(false);
  // }, []);

  const login = async (email, password) => {
    try {
      // Call backend login endpoint
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email,
        password,
      });
      // The backend returns JwtResponse
      const { token, id, name, email: userEmail, role, points } = response.data;
      const user = { id, name, email: userEmail, role, points };
      setUser(user);
      setToken(token);
      localStorage.setItem("raastabuzz_user", JSON.stringify(user));
      localStorage.setItem("raastabuzz_token", token);
      return user;
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (userData) => {
    // You may need to adjust this for your backend registration endpoint
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    const { user, token } = response.data;
    setUser(user);
    setToken(token);
    localStorage.setItem("raastabuzz_user", JSON.stringify(user));
    localStorage.setItem("raastabuzz_token", token);
    return user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("raastabuzz_user");
    localStorage.removeItem("raastabuzz_token");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    handleClose,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// In your LoginDialog component
const handleClose = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setShowLogin(false); // or whatever closes the dialog
};
