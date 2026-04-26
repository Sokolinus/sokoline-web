"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      console.log(`[Referral] Tracking code detected: ${ref}`);
      
      // Store in cookie for 7 days
      const expires = new Date();
      expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      document.cookie = `sokoline_ref=${ref};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }
  }, [searchParams]);

  return null;
}
