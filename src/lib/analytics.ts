import { supabase } from "./supabase"

function getSessionId(): string {
  let id = sessionStorage.getItem("_sid")
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem("_sid", id)
  }
  return id
}

let heartbeatTimer: ReturnType<typeof setInterval> | null = null

export function trackPageView(path: string) {
  if (!supabase) return

  const sessionId = getSessionId()
  const referrer = document.referrer || null

  supabase
    .from("page_views")
    .insert({ path, referrer, session_id: sessionId })
    .then()

  // Upsert active session
  supabase
    .from("active_sessions")
    .upsert({ session_id: sessionId, path, last_seen: new Date().toISOString() })
    .then()

  // Heartbeat every 30s
  if (heartbeatTimer) clearInterval(heartbeatTimer)
  heartbeatTimer = setInterval(() => {
    supabase
      .from("active_sessions")
      .upsert({ session_id: sessionId, path, last_seen: new Date().toISOString() })
      .then()
  }, 30_000)
}

export async function trackDownload(filename: string): Promise<boolean> {
  if (!supabase) return false

  const sessionId = getSessionId()

  const { error } = await supabase
    .from("page_views")
    .insert({
      path: filename,
      referrer: window.location.pathname,
      session_id: sessionId,
      event_type: "download",
    })

  if (error) {
    console.error("Download tracking failed:", error.message, error)
    return false
  }
  return true
}

// --- Admin queries ---

export interface AnalyticsData {
  todayViews: number
  totalViews: number
  liveUsers: number
  viewsByPage: { path: string; count: number }[]
  referrers: { referrer: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
  downloads: { file: string; count: number }[]
  totalDownloads: number
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  if (!supabase) {
    return { todayViews: 0, totalViews: 0, liveUsers: 0, viewsByPage: [], referrers: [], viewsByDay: [], downloads: [], totalDownloads: 0 }
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400_000).toISOString()
  const sixtySecsAgo = new Date(now.getTime() - 60_000).toISOString()

  // Clean up stale sessions
  await supabase.from("active_sessions").delete().lt("last_seen", sixtySecsAgo)

  const [todayRes, totalRes, liveRes, allViewsRes, downloadsRes] = await Promise.all([
    // Today's page views
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "pageview")
      .gte("created_at", todayStart),

    // Total page views
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "pageview"),

    // Live users
    supabase
      .from("active_sessions")
      .select("session_id", { count: "exact", head: true })
      .gte("last_seen", sixtySecsAgo),

    // Last 30 days page views for aggregation
    supabase
      .from("page_views")
      .select("path, referrer, created_at")
      .eq("event_type", "pageview")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false })
      .limit(10000),

    // All downloads
    supabase
      .from("page_views")
      .select("path, created_at")
      .eq("event_type", "download"),
  ])

  const rows = allViewsRes.data || []

  // Views by page
  const pageMap = new Map<string, number>()
  for (const r of rows) {
    pageMap.set(r.path, (pageMap.get(r.path) || 0) + 1)
  }
  const viewsByPage = [...pageMap.entries()]
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)

  // Referrers
  const refMap = new Map<string, number>()
  for (const r of rows) {
    if (r.referrer) {
      let host: string
      try {
        host = new URL(r.referrer).hostname
      } catch {
        host = r.referrer
      }
      refMap.set(host, (refMap.get(host) || 0) + 1)
    }
  }
  const referrers = [...refMap.entries()]
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)

  // Views by day (last 30 days)
  const dayMap = new Map<string, number>()
  for (const r of rows) {
    const day = r.created_at.slice(0, 10)
    dayMap.set(day, (dayMap.get(day) || 0) + 1)
  }
  const viewsByDay = [...dayMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Downloads
  const dlRows = downloadsRes.data || []
  const dlMap = new Map<string, number>()
  for (const r of dlRows) {
    const name = r.path.split("/").pop() || r.path
    dlMap.set(name, (dlMap.get(name) || 0) + 1)
  }
  const downloads = [...dlMap.entries()]
    .map(([file, count]) => ({ file, count }))
    .sort((a, b) => b.count - a.count)

  return {
    todayViews: todayRes.count || 0,
    totalViews: totalRes.count || 0,
    liveUsers: liveRes.count || 0,
    viewsByPage,
    referrers,
    viewsByDay,
    downloads,
    totalDownloads: dlRows.length,
  }
}
