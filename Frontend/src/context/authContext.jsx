import { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, name, username }
  const logout = async () => {
    setUser(null);
    const res = await fetch("https://tradewise-b8jz.onrender.com/api/logout" , {
      method : "POST",
    })
    
    const data = await res.json();
    if(res.ok){
      console.log(data);
    } else {
      alert(data.message || "login failed");
    }
  }
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  //  Save to localStorage on change
  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   }
  // }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
