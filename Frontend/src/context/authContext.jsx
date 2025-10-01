import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, name, username }
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!API_URL) {
          // console.error("API_URL is not defined. Please set VITE_API_URL environment variable.");
          setUser(null);
          setIsLoading(false);
          return;
        }

        // console.log("Checking auth with API_URL:", API_URL);
        const res = await fetch(`${API_URL}/api/profile`, {
          method: "GET",
          credentials: "include",
        });
        
        if (res.ok) {
          const userData = await res.json();
          // console.log("Auth check successful:", userData);
          setUser(userData);
        } else {
          // console.log("Auth check failed with status:", res.status);
          setUser(null);
        }
      } catch (error) {
        // console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      if (!API_URL) {
        // console.error("API_URL is not defined. Cannot logout.");
        setUser(null);
        return;
      }

      // console.log("Logging out with API_URL:", API_URL);
      const res = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      
      const data = await res.json();
      if (res.ok) {
        // console.log("Logout successful:", data.message);
        setUser(null);
      } else {
        // console.error("Logout failed:", data.message);
        // Still clear user state even if server logout fails
        setUser(null);
      }
    } catch (error) {
      // console.error("Logout error:", error);
      // Still clear user state even if network fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
