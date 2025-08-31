import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name , setName] = useState("");
  const [username , setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("https://tradewise-b8jz.onrender.com/api/register", {
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
    <div className="min-h-screen flex items-center justify-center bg-[#0f111a] text-white"><Navbar />
      <form onSubmit={handleSubmit} className="bg-[#1a1d2b] p-8 rounded-lg shadow-md space-y-4 w-96">
        <h2 className="text-2xl font-bold">Register</h2>
        <input
          type="name"
          placeholder="enter your name"
          className="w-full px-4 py-2 bg-[#2b2f40] rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="username"
          placeholder="Enter a unique username"
          className="w-full px-4 py-2 bg-[#2b2f40] rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 bg-[#2b2f40] rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-[#2b2f40] rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-[#00ffb3] text-black font-bold px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
