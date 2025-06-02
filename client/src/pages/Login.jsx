import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, user } = response.data;

      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify({ ...user, token }));

      navigate("/overview");
    } catch (err) {
      setError("Login failed. Please check your email and password.", err);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-4xl font-bold mb-4 text-center text-blue-600">
          Welcome to CareTrack!
        </h2>
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Login
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded mt-4 font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
          <p className="text-sm text-gray-600 text-center mt-6">
            Don&apos;t have an account?{" "}
            <span
              onClick={navigateToRegister}
              className="text-blue-600 hover:underline hover:text-blue-800 font-medium cursor-pointer"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
