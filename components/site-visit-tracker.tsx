"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function SiteVisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    let sessionId = localStorage.getItem("site_session_id")

    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem("site_session_id", sessionId)
    }

    fetch("/api/track-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_path: pathname,
        session_id: sessionId,
        user_agent: navigator.userAgent,
      }),
    }).catch(console.error)
  }, [pathname])

  return null
}
