"use client";

export default function LoadOverlay({
  loading = false,
  message = "Loading...",
}) {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>

      {/* Message */}
      <p className="mt-4 text-blue-600 text-lg font-semibold bg-white/70 px-3 py-1 rounded">
        {message}
      </p>
    </div>
  );
}
