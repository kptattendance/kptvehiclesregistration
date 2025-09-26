import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "College Vehicle Portal",
  description: "Manage vehicle registrations and scans",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          {/* Navbar */}
          <Navbar />

          {/* Main content grows to fill space */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <footer className="bg-gray-900 shadow-inner py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-center sm:text-left">
            <div className="text-gray-300 text-sm">
              © {new Date().getFullYear()} KPT Mangalore Vehicle Portal. All
              rights reserved.
            </div>
            <div className="text-gray-400 text-sm">
              Maintained by KPT Mangalore CSE final year students.
            </div>
          </footer>

          {/* Global Toaster */}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
