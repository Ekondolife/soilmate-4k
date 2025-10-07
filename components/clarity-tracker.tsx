"use client";

import Script from "next/script";

export default function ClarityTracker() {
  const CLARITY_ID = "tcoo49c9f8";

  // Don't load Clarity on localhost (uncomment for production)
  if (typeof window !== "undefined" && 
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return null;
  }

  return (
      <Script id="clarity-init" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
          
          // Debug: Check if Clarity loaded
          setTimeout(() => {
            if (window.clarity) {
              console.log('✅ Microsoft Clarity loaded successfully!');
            } else {
              console.log('❌ Microsoft Clarity failed to load');
            }
          }, 2000);
        `}
      </Script>
  );
}
