import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Demo users for fallback
  const demoUsers = {
    "contributor@demo.com": {
      id: 1,
      email: "contributor@demo.com",
      name: "Ahmed Rahman",
      role: "CONTRIBUTOR",
      points: 245,
    },
    "moderator@demo.com": {
      id: 2,
      email: "moderator@demo.com",
      name: "Fatima Khan",
      role: "MODERATOR",
      points: 1250,
    },
  };

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("raastabuzz_user");
    const savedToken = localStorage.getItem("raastabuzz_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Try real API first
      const response = await authAPI.login(email, password);
      const { token, ...userData } = response.data;

      setUser(userData);
      localStorage.setItem("raastabuzz_user", JSON.stringify(userData));
      localStorage.setItem("raastabuzz_token", token);

      return userData;
    } catch (error) {
      // Fallback to demo users for development
      const user = demoUsers[email];
      if (user && password === "demo123") {
        setUser(user);
        localStorage.setItem("raastabuzz_user", JSON.stringify(user));
        localStorage.setItem("raastabuzz_token", "demo-token");
        return user;
      }
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  };

  const register = async (userData) => {
    try {
      // Try real API first
      const response = await authAPI.register(
        userData.name,
        userData.email,
        userData.password
      );
      const { token, ...userInfo } = response.data;

      setUser(userInfo);
      localStorage.setItem("raastabuzz_user", JSON.stringify(userInfo));
      localStorage.setItem("raastabuzz_token", token);

      return userInfo;
    } catch (error) {
      // Fallback for development
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: "CONTRIBUTOR",
        points: 0,
      };
      setUser(newUser);
      localStorage.setItem("raastabuzz_user", JSON.stringify(newUser));
      localStorage.setItem("raastabuzz_token", "demo-token");
      return newUser;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("raastabuzz_user");
    localStorage.removeItem("raastabuzz_token");
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
