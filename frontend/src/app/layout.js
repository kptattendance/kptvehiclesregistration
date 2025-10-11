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
  title: " KPT Mangalore | College Vehicle Portal",
  description:
    "A digital portal for managing college vehicle registrations, QR scans, and access records at KPT Mangalore.",
  keywords: [
    "KPT Mangalore Vehicle",
    "KPT Mangalore Vehicles",
    "KPT Mangalore Vehicle Portal",
    "College Vehicle Portal",
    "KPT Vehicle Portal",
    "Vehicle Registration System",
    "QR Code Scanning",
    "KPT diploma College",
    "KPT Mangalore",
    "Campus Vehicle Management",
  ],
  authors: [{ name: "KPT Mangalore CSE Final Year Students" }],
  creator: "KPT Mangalore",
  publisher: "KPT Mangalore",
  metadataBase: new URL("https://kptvehicles.vercel.app"),
  alternates: {
    canonical: "https://kptvehicles.vercel.app",
  },
  openGraph: {
    title: "KPT Mangalore Vehicle Portal | Smart Vehicle Management System",
    description:
      "Easily register and scan vehicles within KPT Mangalore campus through our digital vehicle management portal.",
    url: "https://kptvehicles.vercel.app",
    siteName: "KPT Vehicle Portal",
    images: [
      {
        url: "https://kptvehicles.vercel.app/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KPT Vehicle Portal",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KPT Mangalore Vehicle Portal | Digital Vehicle Management",
    description:
      "Register and scan college vehicles digitally with KPT Mangalore’s Vehicle Portal.",
    images: ["https://kptvehicles.vercel.app/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* ✅ Google Search Console verification tag */}
          <meta
            name="google-site-verification"
            content="FHsNWVXWWRw0Ce3yPMaQAwFy_0M6R_X_s4t8tn6rY_Q"
          />

          {/* ✅ Structured Data for SEO (Organization Schema) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "KPT Mangalore Vehicle Portal",
                url: "https://kptvehicles.vercel.app",
                logo: "https://kptvehicles.vercel.app/images/logo.png",
                description:
                  "A digital system to manage and verify college vehicles through QR-based registration and scanning at KPT Mangalore.",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "KPT Campus, Kadri Hills",
                  addressLocality: "Mangalore",
                  addressRegion: "Karnataka",
                  postalCode: "575004",
                  addressCountry: "IN",
                },
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "Administration Office",
                  availableLanguage: ["English", "Kannada"],
                },
              }),
            }}
          />
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          {/* Navbar */}
          <Navbar className="flex-shrink-0" />

          {/* Main content */}
          <main className="flex-grow flex flex-col">{children}</main>

          {/* Footer */}
          <footer className="flex-shrink-0 bg-gray-900 shadow-inner py-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-center sm:text-left">
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
