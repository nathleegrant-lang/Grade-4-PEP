"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const SESSION_KEY = "site_session_id"
const SESSION_STARTED_KEY = "site_session_started_at"
const SESSION_WINDOW_MS = 30 * 60 * 1000

function getVisitSessionId() {
  const now = Date.now()
  const existingId = localStorage.getItem(SESSION_KEY)
  const startedAt = Number(localStorage.getItem(SESSION_STARTED_KEY) || "0")

  if (existingId && startedAt && now - startedAt < SESSION_WINDOW_MS) return existingId

  const sessionId = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, sessionId)
  localStorage.setItem(SESSION_STARTED_KEY, String(now))
  return sessionId
}

export function SiteVisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const track = async () => {
      const sessionId = getVisitSessionId()
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token

      fetch("/api/track-visit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          page_path: pathname,
          session_id: sessionId,
          user_agent: navigator.userAgent,
        }),
      }).catch(console.error)
    }

    void track()
  }, [pathname])

  return null
}
