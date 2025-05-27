import LoginForm from "../components/forms/LoginForm";
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="font-sans text-gray-900 antialiased">
      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-beige">
        
        <div>
            <a href="/">
              <h2 className="font-bold text-3xl">Nutri<span className="bg-mango text-white px-2 rounded-md">App</span></h2>
            </a>
        </div>
        
        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
          <LoginForm/>
        </div>

        <h3 className="mt-4 text-gray-700">
          Don't have an account?{" "}
          <Link to="/register" className="text-mango font-semibold hover:underline">
            Sign up
          </Link>
        </h3>

      </div>
    </div>
  );
}
