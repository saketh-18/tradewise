import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Navbar from "../Components/Navbar";

export default function Login() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {setUser} = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://tradewise-b8jz.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      console.log(data.token);
      setUser({username});
      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f111a] text-white"><Navbar />
      <form onSubmit={handleSubmit} className="bg-[#1a1d2b] p-8 rounded-lg shadow-md space-y-4 w-96">
        <h2 className="text-2xl font-bold">Login</h2>
        <input
          type="text"
          placeholder="Enter Username"
          className="w-full px-4 py-2 bg-[#2b2f40] rounded"
          value={username}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="w-full px-4 py-2 bg-[#2b2f40] rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-[#00ffb3] text-black font-bold px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
