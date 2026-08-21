import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-6xl font-bold text-brand-600 mb-4">404</h1>
      <p className="text-xl font-semibold text-slate-800 mb-2">
        Page not found
      </p>
      <p className="text-slate-500 mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/">
        <Button className="bg-brand-600 hover:bg-brand-700">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
