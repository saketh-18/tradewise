import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Navbar from "../Components/Navbar";
import { API_URL } from "../config";

export default function Login() {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {setUser} = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("called login")
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      // localStorage.setItem("token", data.token);
      console.log(data.token);
      setUser({username});
      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white relative">
      <Navbar />
      <form onSubmit={handleSubmit} className="bg-[#1a1d2b]/90 backdrop-blur p-8 rounded-xl shadow-xl space-y-4 w-96 border border-white/10">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-sm text-gray-400">Sign in to continue to TradeWise</p>
        </div>
        <input
          type="text"
          placeholder="Enter Username"
          className="w-full px-4 py-2 bg-[#2b2f40] rounded focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder-gray-400"
          value={username}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="w-full px-4 py-2 bg-[#2b2f40] rounded focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-[#00ffb3] text-black font-bold px-4 py-2 rounded transition-transform hover:scale-[1.02]">
          Login
        </button>
        <div className="text-center text-sm text-gray-400">or</div>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full border border-[#00ffb3] text-[#00ffb3] font-semibold px-4 py-2 rounded hover:bg-[#00ffb3] hover:text-black transition-colors"
        >
          Create an account
        </button>
      </form>
    </div>
  );
}
