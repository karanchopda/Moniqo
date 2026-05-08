import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moniqo | AI-Powered Financial Sanctuary",
  description: "Experience the pinnacle of financial clarity. Moniqo's intelligent coach audits your capital flows and cultivates wealth through organic growth.",
  keywords: ["financial AI", "money audit", "Indian finance assistant", "wealth management", "AI auditor", "Emerald Intelligence"],
  authors: [{ name: "Moniqo Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  openGraph: {
    title: "Moniqo | AI-Powered Financial Sanctuary",
    description: "Experience the pinnacle of financial clarity.",
    type: "website",
    url: "https://moniqo.ai",
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
    description: "Experience the pinnacle of financial clarity.",
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
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
          suppressHydrationWarning
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${outfit.variable} antialiased bg-background text-on-surface selection:bg-on-primary-container selection:text-primary overflow-x-hidden`}
        suppressHydrationWarning
      >
        {/* Global Premium Background Elements */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">
          <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-primary-container/5 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/10 rounded-full blur-[120px]"></div>
        </div>
        
        {children}
      </body>
    </html>
  );
}
