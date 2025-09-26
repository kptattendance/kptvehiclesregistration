"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.publicMetadata?.role;

  useEffect(() => {
    if (isSignedIn && role !== "admin" && role !== "user") {
      router.push("/unauthorized");
    }
  }, [isSignedIn, role, router]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Text */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo1.png" alt="College Logo" width={50} height={50} />
            <span className="font-bold text-xl text-white">
              KPT Vehicle Portal
            </span>
          </Link>

          {/* Desktop Links */}
          <SignedIn>
            {role === "admin" && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-white hover:bg-white/20 px-3 py-2 rounded-md transition"
                >
                  Home
                </Link>
                <Link
                  href="/addUser"
                  className="text-white hover:bg-white/20 px-3 py-2 rounded-md transition"
                >
                  Add User
                </Link>
                <Link
                  href="/register-vehicle"
                  className="text-white hover:bg-white/20 px-3 py-2 rounded-md transition"
                >
                  Register Vehicle
                </Link>
                <Link
                  href="/vehicleList"
                  className="text-white hover:bg-white/20 px-3 py-2 rounded-md transition"
                >
                  Vehicle List
                </Link>
                <Link
                  href="/scan"
                  className="text-white hover:bg-white/20 px-3 py-2 rounded-md transition"
                >
                  Scan Vehicle
                </Link>
              </div>
            )}
            {role === "user" && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/scan"
                  className="text-white hover:bg-white/20 px-3 py-2 rounded-md transition"
                >
                  Scan Vehicle
                </Link>
              </div>
            )}
          </SignedIn>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <button className="px-4 py-2 bg-white text-blue-700 font-medium rounded-lg shadow hover:bg-gray-100 transition">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Links */}
        {menuOpen && (
          <SignedIn>
            <div className="md:hidden mt-2 px-2 pb-3 space-y-1">
              {role === "admin" && (
                <>
                  <Link
                    href="/"
                    className="block px-3 py-2 rounded-md text-white hover:bg-white/20 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/addUser"
                    className="block px-3 py-2 rounded-md text-white hover:bg-white/20 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Add User
                  </Link>
                  <Link
                    href="/register-vehicle"
                    className="block px-3 py-2 rounded-md text-white hover:bg-white/20 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register Vehicle
                  </Link>
                  <Link
                    href="/vehicleList"
                    className="block px-3 py-2 rounded-md text-white hover:bg-white/20 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Vehicle List
                  </Link>
                  <Link
                    href="/scan"
                    className="block px-3 py-2 rounded-md text-white hover:bg-white/20 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Scan Vehicle
                  </Link>
                </>
              )}
              {role === "user" && (
                <Link
                  href="/scan"
                  className="block px-3 py-2 rounded-md text-white hover:bg-white/20 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Scan Vehicle
                </Link>
              )}
            </div>
          </SignedIn>
        )}
      </div>
    </nav>
  );
}
