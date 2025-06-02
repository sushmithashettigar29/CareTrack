import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("Patient");
  const [specialization, setSpecialization] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name,
        email,
        phone,
        password,
        age,
        gender,
        role,
        specialization: role === "Doctor" ? specialization : "",
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );

      const { token, user } = response.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userInfo", JSON.stringify({ ...user, token }));

      navigate("/overview");
    } catch (err) {
      setError("Registration failed. Please try again.", err);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-4xl font-bold mb-4 text-center text-blue-600">
          Welcome to CareTrack!
        </h2>
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          Register
        </h3>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full mt-1 p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-1 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label htmlFor="password" className="block text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full mt-1 p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="phone" className="block text-sm font-semibold">
                Phone
              </label>
              <input
                type="number"
                id="phone"
                className="w-full mt-1 p-2 border rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4 flex gap-4">
            <div className="w-1/3">
              <label htmlFor="age" className="block text-sm font-semibold">
                Age
              </label>
              <input
                type="number"
                id="age"
                className="w-full mt-1 p-2 border rounded"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="gender" className="block text-sm font-semibold">
                Gender
              </label>
              <select
                id="gender"
                className="w-full mt-1 p-2 border rounded"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="w-1/3">
              <label htmlFor="role" className="block text-sm font-semibold">
                Role
              </label>
              <select
                id="role"
                className="w-full mt-1 p-2 border rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>
          </div>
          {role === "Doctor" && (
            <div className="mb-4">
              <label
                htmlFor="specialization"
                className="block text-sm font-semibold"
              >
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                className="w-full mt-1 p-2 border rounded"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded mt-4 font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={navigateToLogin}
              className="text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
