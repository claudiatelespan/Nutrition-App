import LoginForm from "../components/LoginForm";
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm/>
      <h3>Don't have an account? <Link to="/register">Sign up</Link></h3>
    </div>
  );
}
