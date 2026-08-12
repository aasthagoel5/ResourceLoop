import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationPicker from "@/components/LocationPicker";

function CreateResource() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "equipment",
    listingType: "donate",
    quantity: 1,
    price: "",
    securityDeposit: "",
    bloodGroup: "",
    condition: "",
    expiryDate: "",
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
        title: formData.title,
        description: formData.description,
        category: formData.category,
        listingType: formData.listingType,
        quantity: Number(formData.quantity),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        address: formData.address,
      };

      if (formData.category === "blood")
        payload.bloodGroup = formData.bloodGroup;
      if (formData.category === "equipment")
        payload.condition = formData.condition;
      if (formData.category === "medicine")
        payload.expiryDate = formData.expiryDate;
      if (formData.listingType === "sell")
        payload.price = Number(formData.price);
      if (formData.listingType === "lend")
        payload.securityDeposit = Number(formData.securityDeposit);

      await api.post("/resources", payload);
      navigate("/resources");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          List a Resource
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
            <Label>Category</Label>
            <div className="flex gap-2">
              {["equipment", "blood", "medicine"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: c })}
                  className={`flex-1 py-2 rounded-md text-sm font-medium capitalize ${
                    formData.category === c
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Listing Type</Label>
            <div className="flex gap-2">
              {[
                { value: "donate", label: "❤️ Donate" },
                { value: "lend", label: "🔄 Lend" },
                { value: "sell", label: "💰 Sell" },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, listingType: t.value })
                  }
                  className={`flex-1 py-2 rounded-md text-sm font-medium ${
                    formData.listingType === t.value
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {t.label}
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

          {formData.category === "blood" && (
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

          {formData.category === "equipment" && (
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                name="condition"
                placeholder="e.g. Good"
                value={formData.condition}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {formData.category === "medicine" && (
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {formData.listingType === "sell" && (
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {formData.listingType === "lend" && (
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
              <Input
                id="securityDeposit"
                name="securityDeposit"
                type="number"
                value={formData.securityDeposit}
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
              placeholder="e.g. Jaipur, Rajasthan"
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
            {loading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateResource;
