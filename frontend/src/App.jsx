import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import OAuthSuccess from "@/pages/OAuthSuccess";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import BrowseResources from "./pages/BrowseResources";
import CreateResource from "./pages/CreateResources";
import ResourceDetail from "./pages/ResourceDetail";
import BrowseRequests from "@/pages/BrowseRequests";
import CreateRequest from "@/pages/CreateRequest";
import RequestDetail from "./pages/RequestDetail";
import MyDonations from "./pages/MyDonations";
import Profile from "./pages/Profile";
import NearbySearch from "./pages/NearbySearch";
import Dashboard from "./pages/Dashboard";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
          Healthcare Resource Exchange
        </span>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          Connecting resources <br className="hidden sm:block" />
          <span className="text-brand-600">to those who need them</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Donate, lend, or exchange medical equipment, blood, and medicines —
          directly with hospitals, NGOs, and individuals near you.
        </p>

        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Button
              size="lg"
              className="bg-brand-600 hover:bg-brand-700"
              onClick={() => navigate("/resources")}
            >
              Browse Resources
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                className="bg-brand-600 hover:bg-brand-700"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Log In
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 text-left">
          {[
            {
              emoji: "❤️",
              title: "Donate",
              desc: "Give resources for free to those in need, no strings attached.",
            },
            {
              emoji: "🔄",
              title: "Lend",
              desc: "Share temporarily with a refundable security deposit.",
            },
            {
              emoji: "💰",
              title: "Sell",
              desc: "Set a fair price for equipment you no longer need.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/resources" element={<BrowseResources />} />
        <Route path="/resources/new" element={<CreateResource />} />
        <Route path="/resources/:id" element={<ResourceDetail />} />
        <Route path="/requests" element={<BrowseRequests />} />
        <Route path="/requests/new" element={<CreateRequest />} />
        <Route path="/requests/:id" element={<RequestDetail />} />
        <Route path="/donations" element={<MyDonations />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nearby" element={<NearbySearch />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
