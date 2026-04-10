import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const PILLS = ["🗺️ Plan itineraries", "⎇ Clone trips", "📸 Share moments", "🌍 Discover places"];

function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");

    if (mode === "register" && !name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email, password }
          : { name, email, password };

      const { data } = await api.post(endpoint, payload);

      // store token + user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.name);
      localStorage.setItem("userId", data._id);

      navigate("/trips");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 placeholder-white/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 mb-3";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">

      {/* Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-white">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✈️</div>
          <h1 className="text-3xl font-bold">TripSync</h1>
          <p className="text-white/70 text-sm mt-2">
            Plan trips. Share adventures. Inspire others.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-6">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                mode === m
                  ? "bg-white text-indigo-600"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Fields */}
        {mode === "register" && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            className={inputClass}
          />
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          className={inputClass}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className={inputClass}
        />

        {/* Error */}
        {error && (
          <p className="text-pink-200 text-xs mb-3">{error}</p>
        )}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-white/90 transition text-sm mt-1 disabled:opacity-60"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign In →"
            : "Create Account →"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-white/40 text-xs">why TripSync?</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          {PILLS.map((f) => (
            <span
              key={f}
              className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full text-white/70"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;