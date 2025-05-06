import { BrowserRouter as Router, Routes, Route, useLocation   } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import RecipesPage from './pages/RecipesPage';
import RecommenderPage from './pages/RecommenderPage';
import FriendsPage from './pages/FriendsPage';
import RecipeDetailPage from "./pages/RecipeDetailPage";
import PrivateRoute from "./components/PrivateRoute";
import Sidebar from './components/Sidebar';
import Header from "./components/Header";

function Layout() {
  const location = useLocation();

  const hideNavbarOn = ["/", "/register"];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
      <Header />
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
          <Route path="/recipes/:id"
            element={
              <PrivateRoute>
                <RecipeDetailPage />
              </PrivateRoute>
            }
          />              
        </Routes>
      </div>
    </div>
  );
}

export default function App(){
  return (
    <Router>
      <Layout />
    </Router>
  );
}
