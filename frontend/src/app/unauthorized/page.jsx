"use client";

import Image from "next/image";

export default function UnauthorizedPage() {
  return (
    <div className="relative flex-grow flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/clgimg1.jpg"
        alt="Unauthorized Access"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-800 mb-6">
          You are not authorized to access this portal. Please contact the
          administrator if you believe this is a mistake.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
