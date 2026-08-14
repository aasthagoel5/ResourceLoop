import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const listingBadge = {
  donate: { label: "Donate", className: "bg-rose-100 text-rose-700" },
  lend: { label: "Lend", className: "bg-amber-100 text-amber-700" },
  sell: { label: "Sell", className: "bg-emerald-100 text-emerald-700" },
};

function ResourceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await api.get(`/resources/${id}`);
      setResource(response.data.resource);
    } catch (error) {
      console.error("Failed to fetch resource:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this listing permanently?")) return;
    try {
      await api.delete(`/resources/${id}`);
      navigate("/resources");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete listing.");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await api.post(`/users/me/saved-resources/${id}`);
      setMessage("Saved to your wishlist!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Resource not found.
      </div>
    );
  }

  const badge = listingBadge[resource.listingType];
  const isOwner = user && resource.donorId?._id === user.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-slate-700 mb-6"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="h-56 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-6xl overflow-hidden">
            {resource.images && resource.images.length > 0 ? (
              <img
                src={resource.images[activeImage]}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            ) : resource.category === "blood" ? (
              "🩸"
            ) : resource.category === "medicine" ? (
              "💊"
            ) : (
              "🦽"
            )}
          </div>

          {resource.images && resource.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-white border-t border-slate-100">
              {resource.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-14 w-14 rounded-md overflow-hidden border-2 ${
                    activeImage === i
                      ? "border-brand-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="p-8">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}
              >
                {badge.label}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                {resource.category}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                · {resource.status}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {resource.title}
            </h1>
            {resource.description && (
              <p className="text-slate-600 mb-6">{resource.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-slate-400">Quantity</p>
                <p className="font-medium text-slate-800">
                  {resource.quantity}
                </p>
              </div>
              <div>
                <p className="text-slate-400">Location</p>
                <p className="font-medium text-slate-800">
                  {resource.location?.address || "N/A"}
                </p>
              </div>
              {resource.condition && (
                <div>
                  <p className="text-slate-400">Condition</p>
                  <p className="font-medium text-slate-800">
                    {resource.condition}
                  </p>
                </div>
              )}
              {resource.bloodGroup && (
                <div>
                  <p className="text-slate-400">Blood Group</p>
                  <p className="font-medium text-slate-800">
                    {resource.bloodGroup}
                  </p>
                </div>
              )}
              {resource.listingType === "sell" && (
                <div>
                  <p className="text-slate-400">Price</p>
                  <p className="font-medium text-slate-800">
                    ₹{resource.price}
                  </p>
                </div>
              )}
              {resource.listingType === "lend" && (
                <div>
                  <p className="text-slate-400">Security Deposit</p>
                  <p className="font-medium text-slate-800">
                    ₹{resource.securityDeposit}
                  </p>
                </div>
              )}
              <div>
                <p className="text-slate-400">Listed by</p>
                <p className="font-medium text-slate-800">
                  {resource.donorId?.name || "Unknown"}
                </p>
              </div>
            </div>

            {message && (
              <p className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-md p-2 mb-4">
                {message}
              </p>
            )}

            {!isOwner && user && (
              <Button onClick={handleSave} disabled={saving} variant="outline">
                {saving ? "Saving..." : "🔖 Save to Wishlist"}
              </Button>
            )}

            {isOwner && (
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-400 italic">
                  This is your own listing.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete Listing
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetail;
