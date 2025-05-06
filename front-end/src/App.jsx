import { BrowserRouter as Router, Routes, Route, useLocation   } from 'react-router-dom';
import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const hideNavbarOn = ["/", "/register"];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  const sidebarWidth = shouldHideNavbar ? 0 : isOpen ? 224 : 64;
  return (
    <div>
      {!shouldHideNavbar && <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen((prev) => !prev)} />}

      <div
        className="flex flex-col transition-all duration-300"
        style={{
          marginLeft: `${sidebarWidth}px`
        }}
      >
        {!shouldHideNavbar && <Header />}
        <main className={`bg-[#f8f4f3] min-h-screen ${!shouldHideNavbar ? "mt-16" : ""}`}>
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
        </main>
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
