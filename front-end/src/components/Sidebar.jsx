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

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [recipesOpen, setRecipesOpen] = useState(true);
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

  const navItems = [
    { name: "Profile", icon: <UserIcon className="h-6 w-6" />, path: "/profile" },
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
        {/* recipes dropdown */}
        <div>
          <button
            onClick={() => {
              if (isOpen) {
                setRecipesOpen(!recipesOpen);
              } else {
                setShowExternalDropdown(!showExternalDropdown);
              }
            }}
            className={`flex items-center gap-3 p-4 w-full font-semibold text-md hover:bg-hover focus:outline-none cursor-pointer
            ${!isOpen && showExternalDropdown ? "bg-hover" : ""}
            ${isActiveRecipes || isActiveFavorites ? "text-mango font-bold" : "text-white"}`}
          >
            <BookOpenIcon className="h-6 w-6" />
            {isOpen && <span className="flex-1 text-left">Recipes</span>}
            {isOpen &&
              (recipesOpen ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              ))}
          </button>

          {/* inline dropdown (when sidebar is open) */}
          {isOpen && recipesOpen && (
            <div className=" flex flex-col gap-1">
              <NavLink
                to="/recipes"
                state={{ from: "/recipes" }}
                className={`text-sm pl-12 py-1 hover:bg-hover ${isActiveRecipes ? "text-mango font-semibold" : "hover:text-white"}`}
              >
                Browse Recipes
              </NavLink>
              <NavLink
                to="/favorites"
                state={{ from: "/favorites" }}
                className={`text-sm pl-12 py-1 hover:bg-hover ${isActiveFavorites ? "text-mango font-semibold" : "hover:text-white"}`}
              >
                My Favorites
              </NavLink>
            </div>
          )}

          {/* external floating dropdown (when sidebar is closed) */}
          {!isOpen && showExternalDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-15.5 top-[0.1px] w-48 bg-hover text-white rounded-sm z-50 p-2"
              style={{ boxShadow: "4px 0px 6px rgba(0, 0, 0, 0.1)" }}
            >
              <NavLink
                to="/recipes"
                state={{ from: "/recipes" }}
                onClick={() => setShowExternalDropdown(false)}
                className={`block text-sm py-1 px-2 rounded  ${isActiveRecipes ? "text-mango font-semibold" : "hover:text-mango"}`}
              >
                Browse Recipes
              </NavLink>
              <NavLink
                to="/favorites"
                state={{ from: "/favorites" }}
                onClick={() => setShowExternalDropdown(false)}
                className={`block text-sm py-1 px-2 rounded ${isActiveFavorites ? "text-mango font-semibold" : "hover:text-mango"}`}
              >
                My Favorites
              </NavLink>
            </div>
          )}

        </div>

        {/* other nav items */}
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 text-md font-semibold rounded-md hover:bg-hover transition ${
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
