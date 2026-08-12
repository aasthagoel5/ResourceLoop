import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationPicker from "@/components/LocationPicker";

function CreateRequest() {
  const [formData, setFormData] = useState({
    resourceType: "equipment",
    title: "",
    description: "",
    quantity: 1,
    bloodGroup: "",
    equipmentType: "",
    medicineName: "",
    urgency: "medium",
    latitude: "",
    longitude: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.latitude || !formData.longitude) {
      setError("Please select a location on the map.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        resourceType: formData.resourceType,
        title: formData.title,
        description: formData.description,
        quantity: Number(formData.quantity),
        urgency: formData.urgency,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        address: formData.address,
      };

      if (formData.resourceType === "blood")
        payload.bloodGroup = formData.bloodGroup;
      if (formData.resourceType === "equipment")
        payload.equipmentType = formData.equipmentType;
      if (formData.resourceType === "medicine")
        payload.medicineName = formData.medicineName;

      await api.post("/requests", payload);
      navigate("/requests");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          Post a Request
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-xl border border-slate-200"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Resource Type</Label>
            <div className="flex gap-2">
              {["equipment", "blood", "medicine"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, resourceType: t })}
                  className={`flex-1 py-2 rounded-md text-sm font-medium capitalize ${
                    formData.resourceType === t
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Urgency</Label>
            <div className="flex gap-2">
              {["low", "medium", "high", "emergency"].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: u })}
                  className={`flex-1 py-2 rounded-md text-xs font-medium capitalize ${
                    formData.urgency === u
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          {formData.resourceType === "blood" && (
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Input
                id="bloodGroup"
                name="bloodGroup"
                placeholder="e.g. O+"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {formData.resourceType === "equipment" && (
            <div className="space-y-2">
              <Label htmlFor="equipmentType">Equipment Type</Label>
              <Input
                id="equipmentType"
                name="equipmentType"
                placeholder="e.g. Wheelchair"
                value={formData.equipmentType}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {formData.resourceType === "medicine" && (
            <div className="space-y-2">
              <Label htmlFor="medicineName">Medicine Name</Label>
              <Input
                id="medicineName"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address">Address (display text)</Label>
            <Input
              id="address"
              name="address"
              placeholder="e.g. Ajmer, Rajasthan"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Pick Location</Label>
            <LocationPicker
              latitude={formData.latitude ? Number(formData.latitude) : null}
              longitude={formData.longitude ? Number(formData.longitude) : null}
              onChange={(lat, lng) =>
                setFormData({ ...formData, latitude: lat, longitude: lng })
              }
            />
            {formData.latitude && formData.longitude && (
              <p className="text-xs text-slate-400">
                Selected: {formData.latitude.toFixed(4)},{" "}
                {formData.longitude.toFixed(4)}
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Posting..." : "Post Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateRequest;
