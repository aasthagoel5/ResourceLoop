import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import LoadingSpinner from "@/components/LoadingSpinner";

function Wishlist() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const response = await api.get("/users/me/saved-resources");
      setSaved(response.data.savedResources);
    } catch (error) {
      console.error("Failed to load wishlist:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/users/me/saved-resources/${id}`);
      setSaved(saved.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Failed to remove:", error.message);
    }
  };

  if (loading) return <LoadingSpinner fullScreen={false} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Wishlist</h1>

        {saved.length === 0 ? (
          <p className="text-slate-500">You haven't saved any resources yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {saved.map((r) => (
              <div
                key={r._id}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden"
              >
                <Link to={`/resources/${r._id}`}>
                  <div className="h-32 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-3xl overflow-hidden">
                    {r.images && r.images.length > 0 ? (
                      <img
                        src={r.images[0]}
                        alt={r.title}
                        className="w-full h-full object-cover"
                      />
                    ) : r.category === "blood" ? (
                      "🩸"
                    ) : r.category === "medicine" ? (
                      "💊"
                    ) : (
                      "🦽"
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/resources/${r._id}`}>
                    <h3 className="font-semibold text-slate-900 hover:text-brand-600">
                      {r.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-400 capitalize mb-3">
                    {r.category}
                  </p>
                  <button
                    onClick={() => handleRemove(r._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove from wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
