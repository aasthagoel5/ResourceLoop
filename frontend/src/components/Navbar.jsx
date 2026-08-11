import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-600 hidden sm:inline">
                Hi, {user.name.split(" ")[0]}
              </span>
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
      </div>
    </header>
  );
}

export default Navbar;
