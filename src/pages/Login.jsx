import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {setUser} = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      console.log(data.token);
      setUser({email : email});
      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f111a] text-white">
      <form onSubmit={handleSubmit} className="bg-[#1a1d2b] p-8 rounded-lg shadow-md space-y-4 w-96">
        <h2 className="text-2xl font-bold">Login</h2>
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
          Login
        </button>
      </form>
    </div>
  );
}
