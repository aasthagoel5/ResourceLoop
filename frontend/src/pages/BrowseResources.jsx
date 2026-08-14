import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

const listingBadge = {
  donate: { label: "Donate", className: "bg-rose-100 text-rose-700" },
  lend: { label: "Lend", className: "bg-amber-100 text-amber-700" },
  sell: { label: "Sell", className: "bg-emerald-100 text-emerald-700" },
};

function ResourceCard({ resource }) {
  const badge = listingBadge[resource.listingType];

  return (
    <Link
      to={`/resources/${resource._id}`}
      className="block rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-36 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-4xl overflow-hidden">
        {resource.images && resource.images.length > 0 ? (
          <img
            src={resource.images[0]}
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
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}
          >
            {badge.label}
          </span>
          <span className="text-xs text-slate-400 capitalize">
            {resource.category}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 mb-1">{resource.title}</h3>
        <p className="text-sm text-slate-500">
          {resource.location?.address || "Location not specified"}
        </p>
      </div>
    </Link>
  );
}

function BrowseResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchResources();
  }, [category]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = category ? { category } : {};
      const response = await api.get("/resources", { params });
      setResources(response.data.resources);
    } catch (error) {
      console.error("Failed to fetch resources:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Browse Resources
          </h1>
          <Link
            to="/resources/new"
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-md"
          >
            + List a Resource
          </Link>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-8">
          {["", "blood", "equipment", "medicine"].map((c) => (
            <button
              key={c || "all"}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                category === c
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {c || "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-slate-500">Loading resources...</p>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No resources found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseResources;
