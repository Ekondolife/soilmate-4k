import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Soilmate - Find Your Perfect Plant Companion | Ekondo",
  description:
    "Discover your perfect plant companion with Soilmate, Ekondo's plant personality quiz. Connect with nature and find plants that match your lifestyle, care preferences, and space. Join Ekondo's mission to promote environmental sustainability and wellness.",
  keywords:
    "plant quiz, plant personality, indoor plants, plant matching, Ekondo, environmental sustainability, wellness, nature, plant care, plant companion",
  authors: [{ name: "Ekondo" }],
  creator: "Ekondo",
  publisher: "Ekondo",
  robots: "index, follow",
  openGraph: {
    title: "Soilmate - Find Your Perfect Plant Companion | Ekondo",
    description:
      "Discover your perfect plant companion with Soilmate, Ekondo's plant personality quiz. Connect with nature and find plants that match your lifestyle.",
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
    description:
      "Discover your perfect plant companion with Soilmate, Ekondo's plant personality quiz. Connect with nature and find plants that match your lifestyle.",
    images: ["/placeholder.jpg"],
  },
  alternates: {
    canonical: "https://v0-remix-of-plant-matching-app.vercel.app",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
