import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, matchPath } from "react-router-dom";
import {
  UserIcon,
  BookOpenIcon,
  SparklesIcon,
  UsersIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import SidebarDropdown from "./SidebarDropdown";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [recipesOpen, setRecipesOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(true);
  const [showExternalDropdown, setShowExternalDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef();

  const matchRecipeDetail = matchPath("/recipes/:id", location.pathname);
  const fromPath = location.state?.from;

  const isActiveRecipes =
    location.pathname === "/recipes" ||
    (matchRecipeDetail && fromPath?.startsWith("/recipes"));

  const isActiveFavorites =
    location.pathname === "/favorites" ||
    (matchRecipeDetail && fromPath?.startsWith("/favorites"));

  const isActiveDashboard = location.pathname === "/dashboard";
  const isActiveDetails = location.pathname === "/details";

  const navItems = [
    { name: "Chef’s Helper", icon: <SparklesIcon className="h-6 w-6" />, path: "/recommender" },
    { name: "Friends", icon: <UsersIcon className="h-6 w-6" />, path: "/friends" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowExternalDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`fixed top-0 left-0 h-screen bg-vintage text-white transition-all duration-300 z-50 ${isOpen ? "w-56" : "w-16"} flex flex-col`}>
      <div className="p-4 flex items-center gap-2 justify-between">
        <button onClick={toggleSidebar}>
          <Bars3Icon className="h-6 w-6 text-white font-bold cursor-pointer hover:text-gray-300" />
        </button>
        {isOpen && (
          <h2 className="font-bold text-xl whitespace-nowrap">
            Nutri<span className="bg-mango text-white px-2 rounded-md">App</span>
          </h2>
        )}
      </div>

      <div className="flex-1 relative">

        {/* My Profile dropdown */}
        <SidebarDropdown
          isOpen={isOpen}
          title="My Profile"
          icon={<UserIcon className="h-6 w-6" />}
          isActive={isActiveDashboard || isActiveDetails}
          open={profileOpen}
          setOpen={setProfileOpen}
          links={[
            { to: "/dashboard", label: "Dashboard", active: isActiveDashboard },
            { to: "/details", label: "Personal Details", active: isActiveDetails },
          ]}
        />


        {/* Recipes dropdown (same as before) */}
        <SidebarDropdown
          isOpen={isOpen}
          title="Recipes"
          icon={<BookOpenIcon className="h-6 w-6" />}
          isActive={isActiveRecipes || isActiveFavorites}
          open={recipesOpen}
          setOpen={setRecipesOpen}
          links={[
            { to: "/recipes", label: "Browse Recipes", active: isActiveRecipes },
            { to: "/favorites", label: "My Favorites", active: isActiveFavorites },
          ]}
        />


        {/* static nav items */}
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 text-lg font-semibold rounded-md hover:bg-hover transition ${
                isActive ? "text-mango font-bold" : "text-white"
              }`
            }
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
