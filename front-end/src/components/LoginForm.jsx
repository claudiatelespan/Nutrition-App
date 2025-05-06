import { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';


export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData, rememberMe);
      
      toast.success("Login successful");

      console.log("Login successful");
      navigate("/profile");
    } catch (err) {
      toast.error(err.message);
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

      <div className="block mt-4">
        <label htmlFor="remember_me" className="flex items-center">
            <input 
              type="checkbox" 
              id="remember_me" 
              name="remember" 
              className = 'rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500'
              checked = {rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
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