import { BrowserRouter as Router, Routes, Route, useLocation   } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import RecipesPage from './pages/RecipesPage';
import RecommenderPage from './pages/RecommenderPage';
import FriendsPage from './pages/FriendsPage';
import PrivateRoute from "./components/PrivateRoute";
import Navbar from './components/Navbar';

function Layout() {
  const location = useLocation();

  const hideNavbarOn = ["/", "/register"];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);
  return (
    <>
      <div className="min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route path="/recipes"
            element={
              <PrivateRoute>
                <RecipesPage />
              </PrivateRoute>
            }
          /> 

          <Route path="/recommender"
            element={
              <PrivateRoute>
                <RecommenderPage />
              </PrivateRoute>
            }
          />   
          <Route path="/friends"
            element={
              <PrivateRoute>
                <FriendsPage />
              </PrivateRoute>
            }
          />                   
        </Routes>
      </div>

      {!shouldHideNavbar && <Navbar />}
    </>
  );
}

export default function App(){
  return (
    <Router>
      <Layout />
    </Router>
  );
}
