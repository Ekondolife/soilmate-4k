"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GA4Tracker() {
  const GA_ID = process.env.NEXT_PUBLIC_GA4_ID || "G-7WXS48Z1EP";
  const pathname = usePathname();

  // Track client-side route changes
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.gtag &&
      pathname
    ) {
      console.log('🔍 GA4: Tracking page view for:', pathname);
      window.gtag("config", GA_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, GA_ID]);

  // Enable GA4 on localhost for testing (comment out for production)
  // if (!GA_ID || 
  //     (typeof window !== "undefined" && 
  //      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))) {
  //   return null;
  // }

  if (!GA_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            wait_for_update: 500
          });
          gtag('config', '${GA_ID}', { send_page_view: true });
          
          // Debug: Check if GA4 loaded
          setTimeout(() => {
            if (window.gtag) {
              console.log('✅ Google Analytics 4 loaded successfully!');
              console.log('📊 GA4 ID:', '${GA_ID}');
            } else {
              console.log('❌ Google Analytics 4 failed to load');
            }
          }, 2000);
        `}
      </Script>
    </>
  );
}
