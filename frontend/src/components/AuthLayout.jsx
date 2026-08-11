import { Link } from "react-router-dom";

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left branding panel — hidden on small screens */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-brand-600 to-brand-900 text-white p-12 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
            RL
          </div>
          <span className="font-semibold text-lg">ResourceLoop</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight mb-4">
            Every resource shared is a life made a little easier.
          </h2>
          <p className="text-brand-100 text-sm leading-relaxed">
            Join hospitals, NGOs, and individuals already exchanging medical
            equipment, blood, and medicines across their communities.
          </p>
        </div>

        <p className="relative z-10 text-xs text-brand-100/70">
          © {new Date().getFullYear()} ResourceLoop. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
              RL
            </div>
            <span className="font-semibold text-lg text-slate-800">
              ResourceLoop
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mb-8">{subtitle}</p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
