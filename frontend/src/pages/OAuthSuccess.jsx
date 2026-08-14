import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      // We have tokens but not the user's profile info yet — fetch it
      fetchUserAndLogin(accessToken, refreshToken);
    } else {
      navigate("/login");
    }
  }, []);

  const fetchUserAndLogin = async (accessToken, refreshToken) => {
    try {
      localStorage.setItem("accessToken", accessToken);

      const response = await api.get("/users/me");
      const u = response.data.user;

      // Normalize to the same shape used by normal email/password login,
      // so "id" is always available consistently across the app
      login(
        { id: u._id, name: u.name, role: u.role },
        accessToken,
        refreshToken,
      );
      navigate("/");
    } catch (error) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-600">Signing you in...</p>
    </div>
  );
}

export default OAuthSuccess;
