import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/StatCard";
import LoadingSpinner from "@/components/LoadingSpinner";

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get(`/dashboard/${user.role}`);
      setData(response.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen={false} />;
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Failed to load dashboard.
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 capitalize">
          {user.role} Dashboard
        </h1>

        {user.role === "individual" && <IndividualView data={data} />}
        {user.role === "hospital" && <HospitalView data={data} />}
        {user.role === "ngo" && <NGOView data={data} />}
        {user.role === "admin" && <AdminView data={data} />}
      </div>
    </div>
  );
}

function IndividualView({ data }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Donations"
          value={data.myDonations.count}
          color="rose"
        />
        <StatCard
          label="Requests"
          value={data.myRequests.count}
          color="amber"
        />
        <StatCard
          label="Saved"
          value={data.savedResources.count}
          color="brand"
        />
        <StatCard label="Trust Score" value={data.trustScore} color="emerald" />
      </div>
      <Link to="/profile" className="text-brand-600 text-sm hover:underline">
        View full profile & history →
      </Link>
    </>
  );
}

function HospitalView({ data }) {
  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <p className="text-sm text-slate-400">Verification Status</p>
        <span
          className={`inline-block text-xs font-medium px-2 py-1 rounded-full capitalize mt-1 ${
            data.hospitalProfile?.verificationStatus === "verified"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {data.hospitalProfile?.verificationStatus || "pending"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Inventory"
          value={data.inventory.count}
          color="brand"
        />
        <StatCard
          label="Received Donations"
          value={data.receivedDonations.count}
          color="emerald"
        />
        <StatCard
          label="Active Requests"
          value={data.activeRequests.count}
          color="amber"
        />
      </div>
      <Link
        to="/resources/new"
        className="text-brand-600 text-sm hover:underline"
      >
        + List a resource →
      </Link>
    </>
  );
}

function NGOView({ data }) {
  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <p className="text-sm text-slate-400">Verification Status</p>
        <span
          className={`inline-block text-xs font-medium px-2 py-1 rounded-full capitalize mt-1 ${
            data.ngoProfile?.verificationStatus === "verified"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {data.ngoProfile?.verificationStatus || "pending"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Resources Managed"
          value={data.resourcesManaged.count}
          color="brand"
        />
        <StatCard
          label="Donations Facilitated"
          value={data.donationsFacilitated.count}
          color="emerald"
        />
      </div>
    </>
  );
}

function AdminView({ data }) {
  return (
    <>
      <h2 className="font-semibold text-slate-700 mb-3">Users</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={data.users.total} color="brand" />
        <StatCard
          label="Individuals"
          value={data.users.individuals}
          color="emerald"
        />
        <StatCard
          label="Hospitals"
          value={data.users.hospitals}
          color="amber"
        />
        <StatCard label="NGOs" value={data.users.ngos} color="rose" />
      </div>

      <h2 className="font-semibold text-slate-700 mb-3">
        Pending Verifications
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Hospitals"
          value={data.pendingVerifications.hospitals}
          color="amber"
        />
        <StatCard
          label="NGOs"
          value={data.pendingVerifications.ngos}
          color="amber"
        />
        <StatCard
          label="Resources"
          value={data.pendingVerifications.resources}
          color="amber"
        />
        <StatCard
          label="Total Pending"
          value={data.pendingVerifications.total}
          color="rose"
        />
      </div>

      <h2 className="font-semibold text-slate-700 mb-3">Platform Activity</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Resources"
          value={data.platformStats.totalResources}
          color="brand"
        />
        <StatCard
          label="Requests"
          value={data.platformStats.totalRequests}
          color="brand"
        />
        <StatCard
          label="Donations"
          value={data.platformStats.totalDonations}
          color="emerald"
        />
        <StatCard
          label="Completed"
          value={data.platformStats.completedDonations}
          color="emerald"
        />
      </div>

      <Link to="/admin" className="text-brand-600 text-sm hover:underline">
        Go to Admin Panel →
      </Link>
    </>
  );
}

export default Dashboard;
