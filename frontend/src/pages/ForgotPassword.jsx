import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="We'll email you a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        {message && (
          <p className="text-sm text-slate-700 bg-slate-100 border border-slate-200 rounded-md p-2">
            {message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <p className="text-sm text-center text-slate-500 mt-4">
        Remember your password?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPassword;
