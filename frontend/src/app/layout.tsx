import "./globals.css";

import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Moniqo | AI-Powered Financial Sanctuary",
  description: "Upload your bank statement and let Moniqo's AI detect spending leaks, forecast your goals, and build your personal wealth roadmap — in minutes.",
  keywords: ["financial AI", "money audit", "Indian finance assistant", "wealth management", "AI auditor", "Emerald Intelligence"],
  authors: [{ name: "Moniqo Team" }],
  openGraph: {
    title: "Moniqo | AI-Powered Financial Sanctuary",
    description: "Upload your bank statement and let Moniqo's AI detect spending leaks, forecast your goals, and build your personal wealth roadmap — in minutes.",
    type: "website",
    url: "https://moniqoai.vercel.app",
    siteName: "Moniqo",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moniqo AI Financial Sanctuary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moniqo | AI-Powered Financial Sanctuary",
    description: "Upload your bank statement and let Moniqo's AI detect spending leaks, forecast your goals, and build your personal wealth roadmap — in minutes.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
          suppressHydrationWarning
        />
      </head>
      <body
        className="antialiased bg-white text-on-surface selection:bg-on-primary-container selection:text-primary overflow-x-hidden"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
