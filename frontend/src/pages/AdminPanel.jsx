import { useEffect, useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";

const TABS = ["hospitals", "ngos", "resources", "users", "reports"];

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("hospitals");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Panel</h1>

        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "hospitals" && <PendingHospitals />}
        {activeTab === "ngos" && <PendingNGOs />}
        {activeTab === "resources" && <PendingResources />}
        {activeTab === "users" && <AllUsers />}
        {activeTab === "reports" && <Reports />}
      </div>
    </div>
  );
}

function PendingHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/hospitals/pending");
      setHospitals(res.data.hospitals);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    await api.put(`/admin/hospitals/${id}/verify`, { status });
    fetchData();
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (hospitals.length === 0)
    return <p className="text-slate-500">No pending hospitals.</p>;

  return (
    <div className="space-y-3">
      {hospitals.map((h) => (
        <div
          key={h._id}
          className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-slate-800">{h.hospitalName}</p>
            <p className="text-sm text-slate-500">
              {h.userId?.name} · {h.userId?.email}
            </p>
            <p className="text-xs text-slate-400">
              Reg #: {h.registrationNumber} · {h.address}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleVerify(h._id, "verified")}>
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleVerify(h._id, "rejected")}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingNGOs() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/ngos/pending");
      setNgos(res.data.ngos);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    await api.put(`/admin/ngos/${id}/verify`, { status });
    fetchData();
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (ngos.length === 0)
    return <p className="text-slate-500">No pending NGOs.</p>;

  return (
    <div className="space-y-3">
      {ngos.map((n) => (
        <div
          key={n._id}
          className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-slate-800">{n.organizationName}</p>
            <p className="text-sm text-slate-500">
              {n.userId?.name} · {n.userId?.email}
            </p>
            <p className="text-xs text-slate-400">
              Reg ID: {n.registrationId} · {n.address}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleVerify(n._id, "verified")}>
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleVerify(n._id, "rejected")}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/resources/pending");
      setResources(res.data.resources);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    await api.put(`/admin/resources/${id}/verify`, { status });
    fetchData();
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (resources.length === 0)
    return <p className="text-slate-500">No pending resources.</p>;

  return (
    <div className="space-y-3">
      {resources.map((r) => (
        <div
          key={r._id}
          className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-semibold text-slate-800">{r.title}</p>
            <p className="text-sm text-slate-500">
              {r.donorId?.name} · {r.category} · {r.listingType}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleVerify(r._id, "available")}>
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleVerify(r._id, "rejected")}
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove user.");
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-slate-100">
              <td className="px-4 py-3">{u.name}</td>
              <td className="px-4 py-3 text-slate-500">{u.email}</td>
              <td className="px-4 py-3 capitalize">{u.role}</td>
              <td className="px-4 py-3 text-right">
                {u.role !== "admin" && (
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/reports");
      setReports(res.data.reports);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id, status) => {
    await api.put(`/admin/reports/${id}`, { status });
    fetchData();
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (reports.length === 0)
    return <p className="text-slate-500">No pending reports.</p>;

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div
          key={r._id}
          className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-slate-700">{r.reason}</p>
            <p className="text-xs text-slate-400">
              {r.targetType} · reported by {r.reportedBy?.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleResolve(r._id, "reviewed")}>
              Mark Reviewed
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleResolve(r._id, "dismissed")}
            >
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;
