import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import OAuthSuccess from "@/pages/OAuthSuccess";

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 gap-4">
      <h1 className="text-4xl font-bold text-blue-600">ResourceLoop 🔵</h1>
      {user ? (
        <>
          <p className="text-slate-600">
            Log in as {user.name} ({user.role})
          </p>
          <Button onClick={logout} variant="outline">
            LogOut
          </Button>
        </>
      ) : (
        <p className="text-slate-600">Not logged in</p>
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
    </Routes>
  );
}

export default App;
