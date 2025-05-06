import { useState, useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success("Register successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      
      <div className="py-3">
        <center>
          <span className="text-2xl font-semibold">Create your account</span>
        </center>
      </div>
      
      <input
        name="username"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
        className="block font-medium text-gray-700 w-full rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-mango"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="mt-4 block font-medium text-gray-700 w-full rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-mango"
      />

      <div className='mt-4 relative'>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="block font-medium text-gray-700 w-full rounded-md py-2.5 px-4 border border-gray-300 text-sm outline-mango"
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
      
      <div className='flex items-center justify-center mt-4'>
        <button type="submit" className="ms-4 inline-flex items-center px-4 py-2 bg-mango border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-500 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
          Register
        </button>
      </div>

    </form>
  );
}
