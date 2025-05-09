import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
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

  const navItems = [
    { name: "Profile", icon: <UserIcon className="h-6 w-6" />, path: "/profile" },
    { name: "Chef’s Helper", icon: <SparklesIcon className="h-6 w-6" />, path: "/recommender" },
    { name: "Friends", icon: <UsersIcon className="h-6 w-6" />, path: "/friends" },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen bg-vintage text-white transition-all duration-300 z-50 ${isOpen ? "w-56" : "w-16"} flex flex-col`}>
      <div className="p-4 flex items-center gap-2 justify-between">
        <button onClick={toggleSidebar}>
          <Bars3Icon className="h-6 w-6 text-white cursor-pointer" />
        </button>

        {isOpen && (
          <h2 className="font-bold text-xl whitespace-nowrap">
            Nutri<span className="bg-mango text-white px-2 rounded-md">App</span>
          </h2>
        )}
      </div>

      <div className="flex-1">
        {/* Recipes dropdown */}
        <div>
          <button
            onClick={() => setRecipesOpen(!recipesOpen)}
            className="flex items-center gap-3 p-4 w-full text-md hover:bg-hover focus:outline-none cursor-pointer"
          >
            <BookOpenIcon className="h-6 w-6" />
            {isOpen && <span className="flex-1 text-left">Recipes</span>}
            {isOpen && (recipesOpen ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />)}
          </button>
          {recipesOpen && (
            <div className="pl-12 flex flex-col gap-1">
              <NavLink
                to="/recipes"
                className={({ isActive }) =>
                  `text-sm py-1 ${isActive ? "text-mango font-semibold" : "hover:text-white"}`
                }
              >
                Browse Recipes
              </NavLink>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `text-sm py-1 ${isActive ? "text-mango font-semibold" : "hover:text-white"}`
                }
              >
                My Favorites
              </NavLink>
            </div>
          )}
        </div>

        {/* Other nav items */}
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 text-md rounded-md transition ${
                isActive ? "bg-hover" : "hover:bg-hover"
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
