import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-[#C1D8C3] shadow-md px-6 flex justify-end items-center gap-4 z-40">
      <span className="text-gray-700 font-medium text-sm">Welcome</span>
      <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
        <UserCircleIcon className="h-5 w-5 text-gray-600" />
        <span className="text-sm text-gray-800">{user?.username || "Guest"}</span>
      </div>
    </header>
  );
}
