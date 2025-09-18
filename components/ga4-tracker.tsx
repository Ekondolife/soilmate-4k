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
      pathname &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      window.gtag("config", GA_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, GA_ID]);

  if (!GA_ID || 
      (typeof window !== "undefined" && 
       (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))) {
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
            analytics_storage: 'denied',
            ad_storage: 'denied',
            wait_for_update: 500
          });
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
