import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import UtmTracker from "../components/utm-tracker";
import UtmFormInjector from "../components/utm-form-injector";
import GA4Tracker from "../components/ga4-tracker";

export const metadata: Metadata = {
  title: "Soilmate - Find Your Perfect Plant Companion | Ekondo",
  description: "Discover your perfect plant companion with Soilmate, Ekondo's plant personality quiz. Connect with nature and find plants that match your lifestyle, care preferences, and space. Join Ekondo's mission to promote environmental sustainability and wellness.",
  keywords: "plant quiz, plant personality, indoor plants, plant matching, Ekondo, environmental sustainability, wellness, nature, plant care, plant companion",
  authors: [{ name: "Ekondo" }],
  creator: "Ekondo",
  publisher: "Ekondo",
  robots: "index, follow",
  openGraph: {
    title: "Soilmate - Find Your Perfect Plant Companion | Ekondo",
    description: "Discover your perfect plant companion with Soilmate, Ekondo's plant personality quiz. Connect with nature and find plants that match your lifestyle.",
    url: "https://v0-remix-of-plant-matching-app.vercel.app",
    siteName: "Ekondo Soilmate",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Soilmate - Find Your Perfect Plant Companion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soilmate - Find Your Perfect Plant Companion | Ekondo",
    description: "Discover your perfect plant companion with Soilmate, Ekondo's plant personality quiz. Connect with nature and find plants that match your lifestyle.",
    images: ["/placeholder.jpg"],
  },
  alternates: {
    canonical: "https://v0-remix-of-plant-matching-app.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GA4Tracker />
        <UtmTracker />
        <UtmFormInjector />
        {children}
        <Analytics />
        <Script
          id="clarity-script"
          strategy="afterInteractive"
        >
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tcoo49c9f8");
          `}
        </Script>
      </body>
    </html>
  );
}
