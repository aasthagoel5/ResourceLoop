import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import LocationPicker from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";

const listingBadge = {
  donate: { label: "Donate", className: "bg-rose-100 text-rose-700" },
  lend: { label: "Lend", className: "bg-amber-100 text-amber-700" },
  sell: { label: "Sell", className: "bg-emerald-100 text-emerald-700" },
};

function NearbySearch() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [maxDistance, setMaxDistance] = useState(20);
  const [category, setCategory] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!latitude || !longitude) return;
    setLoading(true);
    try {
      const params = { latitude, longitude, maxDistance };
      if (category) params.category = category;

      const response = await api.get("/search/resources", { params });
      setResults(response.data.resources);
    } catch (error) {
      console.error("Search failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Find Resources Near You
        </h1>
        <p className="text-slate-500 mb-6">
          Pick your location to see what's available nearby.
        </p>

        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => setLatitude(lat) || setLongitude(lng)}
          />

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Within</label>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="text-sm border border-slate-200 rounded-md px-2 py-1"
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-sm border border-slate-200 rounded-md px-2 py-1"
              >
                <option value="">All</option>
                <option value="blood">Blood</option>
                <option value="equipment">Equipment</option>
                <option value="medicine">Medicine</option>
              </select>
            </div>

            <Button
              onClick={handleSearch}
              disabled={!latitude || loading}
              className="ml-auto"
            >
              {loading ? "Searching..." : "Search Nearby"}
            </Button>
          </div>
        </div>

        {results !== null && (
          <div>
            <h2 className="font-semibold text-slate-800 mb-3">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </h2>
            {results.length === 0 ? (
              <p className="text-slate-500">
                No resources found nearby. Try a larger radius.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((r) => {
                  const badge = listingBadge[r.listingType];
                  return (
                    <Link
                      key={r._id}
                      to={`/resources/${r._id}`}
                      className="block bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <h3 className="font-semibold text-slate-800 mt-2">
                        {r.title}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {r.location?.address}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NearbySearch;
