import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const urgencyBadge = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  emergency: "bg-red-100 text-red-700",
};

function RequestCard({ request }) {
  return (
    <Link
      to={`/requests/${request._id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${urgencyBadge[request.urgency]}`}
          >
            {request.urgency}
          </span>
          <span className="text-xs text-slate-400 capitalize">
            {request.resourceType}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">{request.title}</h3>
        {request.description && (
          <p className="text-sm text-slate-500 mb-2">{request.description}</p>
        )}
        <p className="text-sm text-slate-400">
          📍 {request.location?.address || "Location not specified"}
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Requested by {request.requesterId?.name || "Unknown"}
        </p>
      </div>
    </Link>
  );
}

function BrowseRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urgency, setUrgency] = useState("");

  useEffect(() => {
    fetchRequests();
  }, [urgency]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = urgency ? { urgency } : {};
      const response = await api.get("/requests", { params });
      setRequests(response.data.requests);
    } catch (error) {
      console.error("Failed to fetch requests:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Community Requests
          </h1>
          <Link
            to="/requests/new"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            + Post a Request
          </Link>
        </div>

        <div className="flex gap-2 mb-8">
          {["", "low", "medium", "high", "emergency"].map((u) => (
            <button
              key={u || "all"}
              onClick={() => setUrgency(u)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                urgency === u
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {u || "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner fullScreen={false} />
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No requests found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseRequests;
