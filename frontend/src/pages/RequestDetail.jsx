import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function RequestDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [myMatchingResources, setMyMatchingResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offering, setOffering] = useState(false);
  const [message, setMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const requestRes = await api.get(`/requests/${id}`);
      setRequest(requestRes.data.request);

      // Find MY resources that match this request's category and are still available
      if (user) {
        const resourcesRes = await api.get("/resources", {
          params: { category: requestRes.data.request.resourceType },
        });
        const mine = resourcesRes.data.resources.filter(
          (r) => r.donorId?._id === user.id && r.status === "available",
        );
        setMyMatchingResources(mine);
      }
    } catch (error) {
      console.error("Failed to load request:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this request permanently?")) return;
    try {
      await api.delete(`/requests/${id}`);
      navigate("/requests");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete request.");
    }
  };

  const handleOffer = async (resourceId) => {
    setOffering(true);
    setMessage("");
    try {
      await api.post("/donations", {
        resourceId,
        receiverId: request.requesterId._id,
        requestId: request._id,
      });
      setMessage("Offer sent! Check your My Donations page to track it.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send offer.");
    } finally {
      setOffering(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  if (!request)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Request not found.
      </div>
    );

  const isOwnRequest = user && request.requesterId?._id === user.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700 capitalize">
            {request.urgency}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-3 mb-2">
            {request.title}
          </h1>
          {request.description && (
            <p className="text-slate-600 mb-4">{request.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-slate-400">Type</p>
              <p className="font-medium text-slate-800 capitalize">
                {request.resourceType}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Quantity</p>
              <p className="font-medium text-slate-800">{request.quantity}</p>
            </div>
            <div>
              <p className="text-slate-400">Location</p>
              <p className="font-medium text-slate-800">
                {request.location?.address || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-slate-400">Requested by</p>
              <p className="font-medium text-slate-800">
                {request.requesterId?.name || "Unknown"}
              </p>
            </div>
          </div>

          {message && (
            <p className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-md p-2 mb-4">
              {message}
            </p>
          )}

          {isOwnRequest && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-400 italic">
                This is your own request.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Delete Request
              </Button>
            </div>
          )}

          {!isOwnRequest && user && (
            <div>
              <h2 className="font-semibold text-slate-800 mb-2">
                Can you help?
              </h2>
              {myMatchingResources.length === 0 ? (
                <p className="text-sm text-slate-500">
                  You don't have any matching available resources to offer.
                </p>
              ) : (
                <div className="space-y-2">
                  {myMatchingResources.map((r) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between border border-slate-200 rounded-md p-3"
                    >
                      <span className="text-sm font-medium text-slate-800">
                        {r.title}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleOffer(r._id)}
                        disabled={offering}
                      >
                        {offering ? "Sending..." : "Offer This"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestDetail;
