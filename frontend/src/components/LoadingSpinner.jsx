function LoadingSpinner({ fullScreen = true }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">{spinner}</div>
  );
}

export default LoadingSpinner;
