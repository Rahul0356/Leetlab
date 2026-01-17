import React from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full py-5">
      <div
        className="flex w-full justify-between mx-auto max-w-4xl 
        bg-base-100/80 text-base-content
        shadow-lg backdrop-blur-lg 
        border border-base-300 
        p-4 rounded-2xl"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/leetlab.svg"
            className="h-10 w-10 bg-primary/20 rounded-full p-2"
          />
          <span className="text-lg md:text-2xl font-bold hidden md:block">
            LeetLab
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="avatar"
                />
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-2"
            >
              <li className="font-semibold px-2">
                {authUser?.name}
              </li>

              <li>
                <Link to="/profile">
                  <User className="w-4 h-4" /> My Profile
                </Link>
              </li>

              {authUser?.role === "ADMIN" && (
                <li>
                  <Link to="/add-problem">
                    <Code className="w-4 h-4" /> Add Problem
                  </Link>
                </li>
              )}

              <li>
                <LogoutButton>
                  <LogOut className="w-4 h-4" /> Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
