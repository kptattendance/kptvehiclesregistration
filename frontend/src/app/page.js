"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative w-full h-[90vh] sm:h-[95vh] md:h-[98vh]">
          {/* Image */}
          <Image
            src="/clgimg1.jpg"
            alt="College Campus"
            fill
            priority
            className="object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Welcome to the College Vehicle Registration Portal
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-md sm:max-w-2xl">
              Register your vehicle, scan number plates, and manage vehicle data
              seamlessly.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-3 sm:space-y-0">
              <Link
                href="/register-vehicle"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center w-full sm:w-auto"
              >
                Register Vehicle
              </Link>
              <Link
                href="/scan"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-center w-full sm:w-auto"
              >
                Scan Vehicle
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
