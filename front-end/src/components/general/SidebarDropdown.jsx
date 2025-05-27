import { motion, AnimatePresence } from "framer-motion";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

export default function SidebarDropdown({
  isOpen,
  title,
  icon,
  isActive,
  links = [],
  open,
  setOpen,
}) {
  return (
    <div>
      <button
        onClick={() => isOpen && setOpen(!open)}
        className={`flex items-center gap-3 p-4 w-full font-semibold text-md hover:bg-hover focus:outline-none cursor-pointer
        ${isActive ? "text-mango font-bold" : "text-white"}`}
      >
        {icon}
        {isOpen && <span className="flex-1 text-lg text-left">{title}</span>}
        {isOpen && (open ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />)}
      </button>

      <AnimatePresence>
        {isOpen && open && (
          <motion.div
            key={`${title}-dropdown`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col gap-1 overflow-hidden"
          >
            {links.map(({ to, label, active }) => (
              <NavLink
                key={to}
                to={to}
                className={`text-md pl-12 py-1 hover:bg-hover ${active ? "text-mango font-semibold" : "hover:text-white"}`}
              >
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
