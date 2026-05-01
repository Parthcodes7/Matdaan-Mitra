import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matdaan-Mitra — Your Intelligent Democracy Assistant",
  description:
    "An AI-powered application providing real-time, personalized voting assistance and democratic education.",
  keywords: [
    "election",
    "voting",
    "AI",
    "guide",
    "India",
    "voter registration",
    "democracy",
    "polling booth",
    "Voter ID",
  ],
  authors: [{ name: "Matdaan-Mitra Team" }],
  openGraph: {
    title: "Matdaan-Mitra",
    description: "Your intelligent democracy assistant.",
    url: "https://matdaan-mitra.com",
    siteName: "Matdaan-Mitra",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matdaan-Mitra",
    description: "Your intelligent democracy assistant.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-screen antialiased selection:bg-accent/30 flex flex-col">
        {/* Skip Navigation Link — Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-[1000] focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>
        <main id="main-content" role="main" aria-label="Matdaan-Mitra Application">
          {children}
        </main>
      </body>
    </html>
  );
}
