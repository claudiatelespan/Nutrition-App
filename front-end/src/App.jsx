import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RecipesPage from './pages/RecipesPage';
import RecommenderPage from './pages/RecommenderPage';
import FriendsPage from './pages/FriendsPage';
import RecipeDetailPage from "./pages/RecipeDetailPage";
import MyFavoritesPage from "./pages/MyFavoritesPage";
import DashboardPage from "./pages/DashboardPage";
import PersonalDetailsPage from "./pages/PersonalDetailsPage";
import ShoppingListPage from './pages/ShoppingListPage';
import PrivateRoute from "./components/general/PrivateRoute";
import Sidebar from './components/general/Sidebar';
import Header from "./components/general/Header";

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
        <main className='bg-[#f8f4f3] min-h-screen'>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route path="/details"
              element={
                <PrivateRoute>
                  <PersonalDetailsPage />
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

            <Route path="/favorites"
              element={
                <PrivateRoute>
                  <MyFavoritesPage />
                </PrivateRoute>
              }
            />

            <Route path="/shopping-list"
              element={
                <PrivateRoute>
                  <ShoppingListPage />
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
