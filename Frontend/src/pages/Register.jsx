import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { API_URL } from "../config";
import {FaInfoCircle} from "react-icons/fa";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name , setName] = useState("");
  const [username , setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password , username , name }),
    });

    // Defensive: safely try to parse JSON
    let data = {};
    try {
      data = await res.json();
    } catch (err) {
      console.warn("No JSON in response");
    }

    if (res.ok) {
      // alert("Registered successfully");
      console.log("registered Succesfully");
      navigate("/login");
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("Register error:", err);
    alert("Registration failed - Network or Server Error");
  }
};

  return (
   <div className="bg-gradient-to-r from-gray-900 to-black min-h-screen text-white relative">
  <Navbar />

  <div className="w-full min-h-screen flex items-center justify-center px-6">
    <div className="bg-[#1a1d2b]/90 text-white w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur border border-white/10 mt-16">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-gray-400 mt-1">Start your journey with TradeWise</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name */}
        <div className="relative">
          <input
            id="name"
            type="text"
            className="bg-[#2b2f40] text-white w-full px-4 py-3 rounded-xl peer placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label
            htmlFor="name"
            className="text-gray-400 peer-focus:text-white absolute left-4 -top-2 text-xs px-2 rounded bg-transparent transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-xs"
          >
            Full name
          </label>
          
        </div>

        {/* Username */}
        <div className="relative">
          <input
            id="username"
            type="text"
            className="bg-[#2b2f40] text-white w-full px-4 py-3 rounded-xl peer placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label
            htmlFor="username"
            className="text-gray-400 peer-focus:text-white absolute left-4 -top-2 text-xs px-2 rounded bg-transparent transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-5 peer-focus:text-xs"
          >
            Username
          </label>
          
        </div>

        {/* Email */}
        <div className="relative">
          <input
            id="email"
            type="email"
            className="bg-[#2b2f40] text-white w-full px-4 py-3 rounded-xl peer placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label
            htmlFor="email"
            className="text-gray-400 peer-focus:text-white absolute left-4 -top-2 text-xs px-2 rounded bg-transparent transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-xs"
          >
            Email
          </label>
          
        </div>

        {/* Password */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="text-gray-300 text-sm">Password</label>
            <div className="relative group">
              <FaInfoCircle className="text-gray-400" />
              <div className="absolute right-0 mt-2 w-64 bg-[#2b2f40] text-gray-200 border border-white/10 rounded-lg p-3 text-xs shadow-xl opacity-0 group-hover:opacity-100 group-hover:z-20 transition-opacity pointer-events-none">
                Use at least 8 characters, with letters and numbers.
              </div>
            </div>
          </div>
          <div className="relative">
            <input
              id="password"
              type="password"
              className="bg-[#2b2f40] text-white w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 pr-12"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-black transition-transform hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, #00ffb3 0%, #8ef8e3 100%)" }}
        >
          <span className="relative z-10">Create account</span>
        </button>        

        {/* Footer links */}
        <div className="flex items-center justify-between text-sm mt-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            Already have an account? <span className="underline">Log in</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  );
}

