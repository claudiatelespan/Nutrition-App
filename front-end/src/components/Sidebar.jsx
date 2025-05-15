import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, matchPath, useNavigate } from "react-router-dom";
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
  const [externalDropdownOpen, setExternalDropdownOpen] = useState(null);
  const location = useLocation();

  const matchRecipeDetail = matchPath("/recipes/:id", location.pathname);
  const fromPath = location.state?.from;

  const isActiveRecipes =
    location.pathname === "/recipes" ||
    (matchRecipeDetail && fromPath?.startsWith("/recipes"));

  const isActiveFavorites =
    location.pathname === "/favorites" ||
    (matchRecipeDetail && fromPath?.startsWith("/favorites"));

  const isActiveFriends =
    location.pathname === "/friends" ||
    (matchRecipeDetail && fromPath?.startsWith("/friends"));


  const isActiveDashboard = location.pathname === "/dashboard";
  const isActiveDetails = location.pathname === "/details";

  const navItems = [
    { name: "Chef’s Helper", icon: <SparklesIcon className="h-6 w-6" />, path: "/recommender" },
    { name: "Friends", icon: <UsersIcon className="h-6 w-6" />, path: "/friends", active: isActiveFriends },
  ];

  const ExternalDropdown = ({ icon, items, id, activeDropdown, setActiveDropdown }) => {
    const ref = useRef();
    const navigate = useNavigate();
    const anyItemActive = items.some(item => item.active);

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
          className={`flex items-center gap-3 p-4 w-full font-semibold text-md hover:bg-hover focus:outline-none cursor-pointer ${
            activeDropdown === id ? "bg-hover" : ""
          } ${anyItemActive ? "text-mango font-bold" : "text-white"}`}
        >
          {icon}
        </button>
        <AnimatePresence mode="wait" initial={false}>
          {activeDropdown === id && (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute left-16 top-0 w-48 bg-hover text-white rounded-sm z-50 p-2 shadow-lg"
            >
              {items.map(({ to, label, active }) => (
                <button
                  key={to}
                  onClick={() => {
                    setActiveDropdown(null);
                    navigate(to, { state: { from: location.pathname } });
                  }}
                  className={`block w-full text-left text-sm py-1 px-2 rounded cursor-pointer ${
                    active ? "text-mango font-semibold" : "hover:text-mango"
                  }`}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };


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

      {isOpen ? (
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
       ) : (
        <ExternalDropdown
          id="profile"
          icon={<UserIcon className="h-6 w-6" />}
          items={[
            { to: "/dashboard", label: "Dashboard", active: isActiveDashboard },
            { to: "/details", label: "Personal Details", active: isActiveDetails },
          ]}
          activeDropdown={externalDropdownOpen}
          setActiveDropdown={setExternalDropdownOpen}
        />
      )}



        {/* Recipes dropdown (same as before) */}
      {isOpen ? (
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
       ) : (
        <ExternalDropdown
          id="recipes"
          icon={<BookOpenIcon className="h-6 w-6" />}
          items={[
            { to: "/recipes", label: "Browse Recipes", active: isActiveRecipes },
            { to: "/favorites", label: "My Favorites", active: isActiveFavorites },
          ]}
          activeDropdown={externalDropdownOpen}
          setActiveDropdown={setExternalDropdownOpen}
        />
      )}

        {/* static nav items */}
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-4 text-lg font-semibold rounded-md hover:bg-hover transition ${
                item.active || isActive ? "text-mango font-bold" : "text-white"
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
