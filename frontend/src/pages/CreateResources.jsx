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
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles].slice(0, 5)); // append, cap at 5 total
    e.target.value = ""; // reset so the same input can be used again to add more
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    if (
      (formData.category === "equipment" || formData.category === "medicine") &&
      images.length === 0
    ) {
      setError("Please upload at least one photo for this category.");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("listingType", formData.listingType);
      payload.append("quantity", formData.quantity);
      payload.append("latitude", formData.latitude);
      payload.append("longitude", formData.longitude);
      payload.append("address", formData.address);

      if (formData.category === "blood")
        payload.append("bloodGroup", formData.bloodGroup);
      if (formData.category === "equipment")
        payload.append("condition", formData.condition);
      if (formData.category === "medicine")
        payload.append("expiryDate", formData.expiryDate);
      if (formData.listingType === "sell")
        payload.append("price", formData.price);
      if (formData.listingType === "lend")
        payload.append("securityDeposit", formData.securityDeposit);

      // Attach each selected image file
      images.forEach((file) => payload.append("images", file));

      await api.post("/resources", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
            <Label htmlFor="images">
              Photos{" "}
              {(formData.category === "equipment" ||
                formData.category === "medicine") && (
                <span className="text-red-500">*</span>
              )}{" "}
              (up to 5)
            </Label>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {images.map((file, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-16 w-16 object-cover rounded-md border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
            )}
            <p className="text-xs text-slate-400">
              {images.length}/5 photos selected
            </p>
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
