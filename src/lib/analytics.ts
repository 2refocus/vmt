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

// --- Admin queries ---

export interface AnalyticsData {
  todayViews: number
  totalViews: number
  liveUsers: number
  viewsByPage: { path: string; count: number }[]
  referrers: { referrer: string; count: number }[]
  viewsByDay: { date: string; count: number }[]
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  if (!supabase) {
    return { todayViews: 0, totalViews: 0, liveUsers: 0, viewsByPage: [], referrers: [], viewsByDay: [] }
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400_000).toISOString()
  const sixtySecsAgo = new Date(now.getTime() - 60_000).toISOString()

  // Clean up stale sessions
  await supabase.from("active_sessions").delete().lt("last_seen", sixtySecsAgo)

  const [todayRes, totalRes, liveRes, allViewsRes] = await Promise.all([
    // Today's views
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart),

    // Total views
    supabase
      .from("page_views")
      .select("id", { count: "exact", head: true }),

    // Live users
    supabase
      .from("active_sessions")
      .select("session_id", { count: "exact", head: true })
      .gte("last_seen", sixtySecsAgo),

    // Last 30 days raw data for aggregation
    supabase
      .from("page_views")
      .select("path, referrer, created_at")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false })
      .limit(10000),
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

  return {
    todayViews: todayRes.count || 0,
    totalViews: totalRes.count || 0,
    liveUsers: liveRes.count || 0,
    viewsByPage,
    referrers,
    viewsByDay,
  }
}
