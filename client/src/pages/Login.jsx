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
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      if (user.role === "Doctor") {
        user.isApproved
          ? navigate("/doctor-dashboard")
          : navigate("/doctor-waiting");
      } else if (user.role === "Patient") {
        navigate("/patient-dashboard");
      } else if (user.role === "Admin") {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError("Login failed. Please try again.", err);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <img
          src="/login-side-image.png"
          alt="Login"
          className="md:w-full lg:w-2/3 max-w-full max-h-full object-contain"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6 h-screen md:h-auto">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-center color-welcome">Welcome to CareTrack!</h2>
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full mt-1 p-2 bg-[#ffffff] rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-2 bg-[#ffffff] rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded mt-4 font-semibold"
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
    </div>
  );
};

export default Login;
