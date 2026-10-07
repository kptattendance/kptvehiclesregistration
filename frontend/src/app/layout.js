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
  title: "KPT Mangalore | College Vehicle Portal",

  description:
    "Official KPT Mangalore College Vehicle Portal for vehicle registration, QR code scanning, and campus vehicle access management.",

  keywords: [
    "KPT Mangalore Vehicle",
    "KPT Mangalore Vehicles",
    "KPT Mangalore Vehicle Portal",
    "KPT Vehicle Portal",
    "College Vehicle Portal",
    "Vehicle Registration System",
    "Campus Vehicle Management",
    "QR Code Vehicle Scanning",
    "KPT Mangalore",
    "KPT Polytechnic Mangalore",
    "Karnataka Polytechnic Mangalore",
  ],

  authors: [
    {
      name: "KPT Mangalore CSE Final Year Students",
    },
  ],

  creator: "KPT Mangalore",

  publisher: "KPT Mangalore",

  metadataBase: new URL("https://vehicles.kptmangaluru.in"),

  alternates: {
    canonical: "https://vehicles.kptmangaluru.in",
  },

  openGraph: {
    title: "KPT Mangalore Vehicle Portal | Smart Vehicle Management System",

    description:
      "Official KPT Mangalore digital vehicle management portal for vehicle registration, QR code scanning, and campus access management.",

    url: "https://vehicles.kptmangaluru.in",

    siteName: "KPT Mangalore Vehicle Portal",

    images: [
      {
        url: "https://vehicles.kptmangaluru.in/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KPT Mangalore Vehicle Portal",
      },
    ],

    locale: "en_IN",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "KPT Mangalore Vehicle Portal | Digital Vehicle Management",

    description:
      "Register and scan college vehicles digitally through the KPT Mangalore Vehicle Portal.",

    images: [
      "https://vehicles.kptmangaluru.in/images/og-image.jpg",
    ],
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
          {/* Google Search Console Verification */}
          <meta
            name="google-site-verification"
            content="O67tWHY9xLUtBxSrAxCliKSiLNqr1KiTwmd_uKb_iVA"
          />

          {/* Structured Data - Organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",

                name: "KPT Mangalore Vehicle Portal",

                url: "https://vehicles.kptmangaluru.in",

                logo: "https://vehicles.kptmangaluru.in/images/logo.png",

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

          {/* Main Content */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>

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