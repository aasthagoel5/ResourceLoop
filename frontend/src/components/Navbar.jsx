import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
            RL
          </div>
          <span className="font-semibold text-lg text-slate-800">
            ResourceLoop
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/resources"
                className="hover:text-brand-600 transition-colors"
              >
                Browse
              </Link>
              <Link
                to="/dashboard"
                className="hover:text-brand-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/requests"
                className="hover:text-brand-600 transition-colors"
              >
                Requests
              </Link>
              <Link
                to="/donations"
                className="hover:text-brand-600 transition-colors"
              >
                My Donations
              </Link>
              <Link
                to="/nearby"
                className="hover:text-brand-600 transition-colors"
              >
                Near Me
              </Link>
              <Link
                to="/wishlist"
                className="hover:text-brand-600 transition-colors"
              >
                Wishlist
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-brand-600 transition-colors"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />
              <Link
                to="/profile"
                className="text-sm text-slate-600 hover:text-brand-600 hidden sm:inline"
              >
                Hi, {user.name.split(" ")[0]}
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
              <Button
                size="sm"
                className="bg-brand-600 hover:bg-brand-700"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
        {/* Mobile menu toggle - only shows below md breakpoint */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileMenuOpen && user && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
          <Link
            to="/resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-600"
          >
            Browse
          </Link>
          <Link
            to="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-600"
          >
            Requests
          </Link>
          <Link
            to="/donations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-600"
          >
            My Donations
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-600"
          >
            Wishlist
          </Link>
          <Link
            to="/nearby"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-600"
          >
            Near Me
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-600"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-600"
          >
            Profile
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-slate-600"
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
