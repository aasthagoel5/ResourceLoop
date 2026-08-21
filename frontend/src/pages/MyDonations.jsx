import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import DonationStepper from "@/components/DonationStepper";

function MyDonations() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteDrafts, setNoteDrafts] = useState({}); // tracks in-progress note edits per donation

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

  const handleAccept = async (id) => {
    try {
      await api.put(`/donations/${id}/accept`);
      fetchDonations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to accept donation.");
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

  const handleCancel = async (id) => {
    try {
      await api.put(`/donations/${id}/cancel`);
      fetchDonations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel donation.");
    }
  };

  const handleSaveNote = async (id) => {
    try {
      await api.put(`/donations/${id}/note`, { note: noteDrafts[id] });
      fetchDonations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save note.");
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
              const isDonor = (d.donorId?._id || d.donorId) === user.id;

              return (
                <div
                  key={d._id}
                  className="bg-white rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-center justify-between mb-2">
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

                  <DonationStepper status={d.status} timeline={d.timeline} />

                  {/* Coordination note — visible to both, editable if not yet completed/cancelled */}
                  {!["completed", "cancelled"].includes(d.status) && (
                    <div className="mt-3">
                      <label className="text-xs text-slate-400">
                        Coordination note (meetup time/place, etc.)
                      </label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          defaultValue={d.coordinationNote || ""}
                          onChange={(e) =>
                            setNoteDrafts({
                              ...noteDrafts,
                              [d._id]: e.target.value,
                            })
                          }
                          placeholder="e.g. Let's meet at City Park, 5 PM tomorrow"
                          className="flex-1 text-sm border border-slate-200 rounded-md px-3 py-1.5"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveNote(d._id)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  )}

                  {d.coordinationNote &&
                    ["completed", "cancelled"].includes(d.status) && (
                      <p className="text-xs text-slate-400 mt-2 italic">
                        Note: {d.coordinationNote}
                      </p>
                    )}

                  {/* Action buttons based on status + role */}
                  <div className="mt-4">
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
