import { useState } from "react";
import { useNavigation, Link, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";

function Register() {
  const [role, setRole] = useState("individual");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    // Hospital-specific
    hospitalName: "",
    registrationNumber: "",
    address: "",
    // NGO-specific
    organizationName: "",
    registrationId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState(null);

  const navigate = useNavigate();

  const handleDocumentChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Build the payload based on selected role — only send relevant fields
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("phone", formData.phone);
      payload.append("location", formData.location);
      payload.append("role", role);

      if (role === "hospital") {
        payload.append("hospitalName", formData.hospitalName);
        payload.append("registrationNumber", formData.registrationNumber);
        payload.append("address", formData.address);
      }

      if (role === "ngo") {
        payload.append("organizationName", formData.organizationName);
        payload.append("registrationId", formData.registrationId);
        payload.append("address", formData.address);
      }

      if (document) {
        payload.append("document", document);
      }

      const response = await api.post("/auth/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Give the user a moment to read the success message, then redirect to login
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join ResourceLoop today">
      {/* Role selector */}
      <div className="flex gap-2 mb-6">
        {["individual", "hospital", "ngo"].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium capitalize transition-colors ${
              role === r
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            {role === "hospital"
              ? "Contact Person Name"
              : role === "ngo"
                ? "Contact Person Name"
                : "Full Name"}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (City)</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Hospital-specific fields */}
        {role === "hospital" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            {(role === "hospital" || role === "ngo") && (
              <div className="space-y-2">
                <Label htmlFor="document">Verification Document</Label>
                <input
                  id="document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  required
                />
                <p className="text-xs text-slate-400">
                  Upload your registration certificate (image or PDF) for admin
                  review.
                </p>
              </div>
            )}
          </>
        )}

        {/* NGO-specific fields */}
        {role === "ngo" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationId">Registration ID</Label>
              <Input
                id="registrationId"
                name="registrationId"
                value={formData.registrationId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            {(role === "hospital" || role === "ngo") && (
              <div className="space-y-2">
                <Label htmlFor="document">Verification Document</Label>
                <input
                  id="document"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
                  required
                />
                <p className="text-xs text-slate-400">
                  Upload your registration certificate (image or PDF) for admin
                  review.
                </p>
              </div>
            )}
          </>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-2">
            {success}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <p className="text-sm text-center text-slate-500 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
