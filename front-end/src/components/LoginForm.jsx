import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { login } from '../services/authService';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';


export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      console.log("Login successful", response);
      navigate("/profile");
      setError("");
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="py-3">
        <center>
          <span className="text-2xl font-semibold">Log In</span>
        </center>
      </div>

      <input
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        className="block font-medium text-gray-700 w-full rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-[#f84525]"
      />

      <div className="mt-4 relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="block font-medium text-gray-700 w-full rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-[#f84525]"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="block mt-4">
        <label htmlFor="remember_me" className="flex items-center">
            <input type="checkbox" id="remember_me" name="remember" className = 'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500'/>
            <span className="ms-2 text-sm text-gray-600">Remember Me</span>
        </label>
      </div>

      <div className='flex items-center justify-end mt-4'>
        <a className="hover:underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="">
          Forgot your password?
        </a>

        <button type="submit" className="ms-4 inline-flex items-center px-4 py-2 bg-[#f84525] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-800 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
          Sign In
        </button>
      </div>

    </form>
  );
}