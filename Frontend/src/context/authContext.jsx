import { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, name, username }
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;
    let fetchTimeoutId = null;
    let controller = null;

    const checkAuth = async () => {
      try {
        if (!API_URL) {
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        // Create abort controller for fetch timeout
        controller = new AbortController();
        fetchTimeoutId = setTimeout(() => {
          if (controller) {
            controller.abort();
          }
        }, 3000); // 3 second fetch timeout

        // Set a safety timeout to always set loading to false
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, 4000); // 4 second absolute timeout

        try {
          const res = await fetch(`${API_URL}/api/profile`, {
            method: "GET",
            credentials: "include",
            signal: controller.signal,
          });
          
          // Clear timeouts on successful response
          if (fetchTimeoutId) clearTimeout(fetchTimeoutId);
          if (timeoutId) clearTimeout(timeoutId);
          
          if (isMounted) {
            if (res.ok) {
              try {
                const userData = await res.json();
                setUser(userData);
              } catch (jsonError) {
                console.error("Error parsing user data:", jsonError);
                setUser(null);
              }
            } else {
              setUser(null);
            }
            setIsLoading(false);
          }
        } catch (fetchError) {
          // Clear fetch timeout
          if (fetchTimeoutId) clearTimeout(fetchTimeoutId);
          
          // Ignore abort errors (expected for timeout)
          if (fetchError.name !== 'AbortError' && isMounted) {
            console.error("Auth check failed:", fetchError);
          }
          
          if (isMounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        // Clear timeout if still exists
        if (timeoutId) clearTimeout(timeoutId);
        if (fetchTimeoutId) clearTimeout(fetchTimeoutId);
        
        if (isMounted) {
          console.error("Auth check error:", error);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Start auth check
    checkAuth();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (fetchTimeoutId) clearTimeout(fetchTimeoutId);
      if (controller) {
        controller.abort();
      }
    };
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
