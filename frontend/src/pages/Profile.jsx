import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [profileRes, donationsRes, requestsRes, savedRes] = await Promise.all([
        api.get("/users/me"),
        api.get("/users/me/donations"),
        api.get("/users/me/requests"),
        api.get("/users/me/saved-resources"),
      ]);
      setProfile(profileRes.data.user);
      setFormData({
        name: profileRes.data.user.name,
        phone: profileRes.data.user.phone || "",
      });
      setDonations(donationsRes.data.donations);
      setRequests(requestsRes.data.requests);
      setSaved(savedRes.data.savedResources);
    } catch (error) {
      console.error("Failed to load profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await api.put("/users/me", formData);
      setProfile(response.data.user);
      setEditing(false);
      setMessage("Profile updated!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-xl">
                {profile.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-lg text-slate-900">{profile.name}</h2>
                <p className="text-sm text-slate-500">{profile.email}</p>
              </div>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-brand-100 text-brand-700 capitalize">
              {profile.role}
            </span>
          </div>

          {message && (
            <p className="text-sm text-brand-700 bg-brand-50 border border-brand-200 rounded-md p-2 mb-4">
              {message}
            </p>
          )}

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Phone</p>
                <p className="font-medium text-slate-800">{profile.phone || "Not set"}</p>
              </div>
              <div>
                <p className="text-slate-400">Location</p>
                <p className="font-medium text-slate-800">{profile.location?.address || "Not set"}</p>
              </div>
              <div>
                <p className="text-slate-400">Trust Score</p>
                <p className="font-medium text-slate-800">{profile.trustScore}</p>
              </div>
              <div className="flex items-end">
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
              </div>
            </div>
          )}
        </div>

        {/* Donation History */}
        <Section title={`My Donations (${donations.length})`}>
          {donations.length === 0 ? (
            <EmptyState text="No donations yet." />
          ) : (
            donations.map((d) => (
              <RowItem
                key={d._id}
                title={d.resourceId?.title || "Resource"}
                subtitle={`To: ${d.receiverId?.name || "Unknown"}`}
                status={d.status}
              />
            ))
          )}
        </Section>

        {/* Request History */}
        <Section title={`My Requests (${requests.length})`}>
          {requests.length === 0 ? (
            <EmptyState text="No requests yet." />
          ) : (
            requests.map((r) => (
              <RowItem key={r._id} title={r.title} subtitle={r.location?.address} status={r.status} />
            ))
          )}
        </Section>

        {/* Saved Resources */}
        <Section title={`Saved Resources (${saved.length})`}>
          {saved.length === 0 ? (
            <EmptyState text="You haven't saved any resources yet." />
          ) : (
            saved.map((r) => (
              <Link
                key={r._id}
                to={`/resources/${r._id}`}
                className="block border border-slate-200 rounded-md p-3 hover:bg-slate-50 mb-2"
              >
                <p className="font-medium text-sm text-slate-800">{r.title}</p>
                <p className="text-xs text-slate-400 capitalize">{r.category}</p>
              </Link>
            ))
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-slate-800 mb-3">{title}</h2>
      <div className="bg-white rounded-xl border border-slate-200 p-4">{children}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="text-sm text-slate-400 text-center py-4">{text}</p>;
}

const statusColor = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-500",
  open: "bg-blue-100 text-blue-700",
  matched: "bg-amber-100 text-amber-700",
  fulfilled: "bg-emerald-100 text-emerald-700",
};

function RowItem({ title, subtitle, status }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0 border-slate-100">
      <div>
        <p className="text-sm font-medium text-slate-800">{title}</p>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColor[status] || "bg-slate-100 text-slate-500"}`}>
        {status}
      </span>
    </div>
  );
}

export default Profile;