import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, UserIcon, BookOpenIcon, SparklesIcon, UsersIcon, Bars3Icon } from "@heroicons/react/24/outline";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Profile", icon: <UserIcon className="h-6 w-6" />, path: "/profile" },
    { name: "Recipes", icon: <BookOpenIcon className="h-6 w-6" />, path: "/recipes" },
    { name: "Chef’s Helper", icon: <SparklesIcon className="h-6 w-6" />, path: "/recommender" },
    { name: "Friends", icon: <UsersIcon className="h-6 w-6" />, path: "/friends" },
  ];

  return (
    <div className={`h-screen bg-vintage text-white transition-all duration-300 ${isOpen ? "w-56" : "w-16"} flex flex-col`}>
      <div className="p-4 flex items-center gap-2 justify-between">
        <button onClick={() => setIsOpen(!isOpen)}>
          <Bars3Icon className="h-6 w-6 text-white cursor-pointer" />
        </button>

        {isOpen && (
          <h2 className="font-bold text-xl whitespace-nowrap">
            Nutri<span className="bg-mango text-white px-2 rounded-md">App</span>
          </h2>
        )}
      </div>


      <div className="flex-1">
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
