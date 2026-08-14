import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const statusColor = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500",
};

function MyDonations() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await api.get("/donations");
      setDonations(response.data.donations);
    } catch (error) {
      console.error("Failed to fetch donations:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/donations/${id}/complete`);
      fetchDonations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to complete donation.");
    }
  };

  const handleAccept = async (id) => {
    try {
      await api.put(`/donations/${id}/accept`);
      fetchDonations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to accept donation.");
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/donations/${id}/cancel`);
      fetchDonations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel donation.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Donations</h1>

        {donations.length === 0 ? (
          <p className="text-slate-500">No donations yet.</p>
        ) : (
          <div className="space-y-4">
            {donations.map((d) => {
              const isDonor =
                d.donorId?._id === user.id || d.donorId === user.id;
              return (
                <div
                  key={d._id}
                  className="bg-white rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[d.status]}`}
                    >
                      {d.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      {isDonor ? "You are donating" : "You are receiving"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800">
                    {d.resourceId?.title || "Resource"}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">
                    {isDonor
                      ? `To: ${d.receiverId?.name || "Unknown"}`
                      : `From: ${d.donorId?.name || "Unknown"}`}
                  </p>

                  {d.status === "pending" && !isDonor && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(d._id)}>
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(d._id)}
                      >
                        Decline
                      </Button>
                    </div>
                  )}

                  {d.status === "pending" && isDonor && (
                    <p className="text-xs text-slate-400 italic">
                      Waiting for receiver to accept...
                    </p>
                  )}

                  {d.status === "accepted" && isDonor && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleComplete(d._id)}>
                        Mark Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(d._id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {d.status === "accepted" && !isDonor && (
                    <p className="text-xs text-slate-400 italic">
                      Accepted — waiting for donor to complete.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyDonations;
