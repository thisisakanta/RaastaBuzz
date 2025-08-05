import { createContext, useContext, useEffect, useState } from "react";

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

  // Demo users
  const demoUsers = {
    "contributor@demo.com": {
      id: 1,
      email: "contributor@demo.com",
      name: "Ahmed Rahman",
      role: "contributor",
      points: 245,
      savedRoutes: [
        { id: 1, name: "Home to Office", from: "Dhanmondi", to: "Gulshan" },
        { id: 2, name: "Office to Gym", from: "Gulshan", to: "Banani" },
      ],
    },
    "moderator@demo.com": {
      id: 2,
      email: "moderator@demo.com",
      name: "Fatima Khan",
      role: "moderator",
      points: 1250,
      savedRoutes: [],
    },
  };

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("raastabuzz_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = demoUsers[email];
        if (user && password === "demo123") {
          setUser(user);
          localStorage.setItem("raastabuzz_user", JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  };

  const register = (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          ...userData,
          role: "contributor",
          points: 0,
          savedRoutes: [],
        };
        setUser(newUser);
        localStorage.setItem("raastabuzz_user", JSON.stringify(newUser));
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("raastabuzz_user");
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
