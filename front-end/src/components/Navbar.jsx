import { NavLink } from "react-router-dom";
import {
  UserIcon,
  BookOpenIcon,
  SparklesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const links = [
    { to: "/profile", label: "My Profile", icon: <UserIcon className="h-6 w-6" /> },
    { to: "/recipes", label: "Recipes", icon: <BookOpenIcon className="h-6 w-6" /> },
    { to: "/recommender", label: "Chef's Helper", icon: <SparklesIcon className="h-6 w-6" /> },
    { to: "/friends", label: "Friends", icon: <UsersIcon className="h-6 w-6" /> },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-black/10 inset-shadow-xs rounded-lg flex justify-around py-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-[#f84525]" : "text-gray-500"
            }`
          }
        >
          {link.icon}
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
