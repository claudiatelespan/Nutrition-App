import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from '../services/authService';

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      console.log("Login successful", response);
      //localStorage.setItem("token", response.token)
      navigate("/profile")
      setError("");
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded shadow-md max-w-sm mx-auto">
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
        Login
      </button>    
    </form>
  );
}
