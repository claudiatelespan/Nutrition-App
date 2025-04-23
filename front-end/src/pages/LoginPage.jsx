import LoginForm from "../components/LoginForm";
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div>
      <LoginForm/>
      <h3>Don't have an account? <Link to="/register">Sign up</Link></h3>
    </div>
  );
}
