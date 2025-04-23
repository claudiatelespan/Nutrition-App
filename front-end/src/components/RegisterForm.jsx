import { useState } from 'react';
import { register } from '../services/authService';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState("");

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      console.log("Register successful", response);
      setError("");
    } catch (err) {
      setError("Register failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
        Register
      </button>
    </form>
  );
}
