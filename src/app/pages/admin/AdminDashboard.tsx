import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "../../components/ui/button"
import {
  fetchRecentSubmissions,
  fetchSubmissionStats,
  listPartnerRows,
  resetAllSubmissions,
} from "../../../lib/partners-api"
import { fetchAnalytics, type AnalyticsData } from "../../../lib/analytics"

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        className="w-full px-5 py-4 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <h2 className="font-semibold text-[#003B79]">{title}</h2>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children}
    </section>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ month: string; partner_slug: string; submission_count: number }[]>([])
  const [recent, setRecent] = useState<any[]>([])
  const [names, setNames] = useState<Record<string, string>>({})
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const liveInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadDashboard = useCallback(async () => {
    const [s, r, partners, analyticsData] = await Promise.all([
      fetchSubmissionStats(),
      fetchRecentSubmissions(40),
      listPartnerRows(),
      fetchAnalytics(),
    ])
    setStats(s)
    setRecent(r)
    setNames(Object.fromEntries(partners.map((p) => [p.slug, p.name])))
    setAnalytics(analyticsData)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        await loadDashboard()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Laden fehlgeschlagen")
      } finally {
        setLoading(false)
      }
    })()

    liveInterval.current = setInterval(async () => {
      try {
        const data = await fetchAnalytics()
        setAnalytics(data)
      } catch { /* ignore */ }
    }, 30_000)

    return () => {
      if (liveInterval.current) clearInterval(liveInterval.current)
    }
  }, [loadDashboard])

  const totalsByPartner = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of stats) {
      map.set(row.partner_slug, (map.get(row.partner_slug) || 0) + Number(row.submission_count))
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [stats])

  const totalAll = totalsByPartner.reduce((sum, [, n]) => sum + n, 0)

  const handleReset = async () => {
    const confirmed = window.confirm(
      `Wirklich alle ${totalAll} Absendungen unwiderruflich löschen?\n\nDas Dashboard wird zurückgesetzt. Partnerdaten bleiben erhalten.`
    )
    if (!confirmed) return

    const typed = window.prompt('Zum Bestätigen bitte „RESET" eingeben:')
    if (typed !== "RESET") {
      setMessage("Reset abgebrochen.")
      return
    }

    setResetting(true)
    setError("")
    setMessage("")
    try {
      const deleted = await resetAllSubmissions()
      await loadDashboard()
      setMessage(`${deleted} Absendung${deleted === 1 ? "" : "en"} gelöscht.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset fehlgeschlagen")
    } finally {
      setResetting(false)
    }
  }

  if (loading) return <p className="text-slate-600">Dashboard wird geladen…</p>

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003B79]">Dashboard</h1>
          <p className="text-slate-600 mt-1">Übersicht der Formular-Absendungen je Verbundpartner.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-50 shrink-0"
          onClick={handleReset}
          disabled={resetting || (totalAll === 0 && recent.length === 0)}
        >
          {resetting ? "Wird gelöscht…" : "Absendungen zurücksetzen"}
        </Button>
      </div>

      <p className="text-xs text-slate-500 -mt-4">
        Löscht nur Formular-Absendungen. Partner und PLZ-Zuordnungen bleiben erhalten. Bestätigung: „RESET".
      </p>

      {message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{message}</p>
      )}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      {/* Analytics KPIs */}
      {analytics && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Besucher jetzt live</p>
            <p className="text-3xl font-bold text-[#A3C410] mt-1">
              <span className="inline-block w-2.5 h-2.5 bg-[#A3C410] rounded-full mr-2 animate-pulse" />
              {analytics.liveUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Seitenaufrufe heute</p>
            <p className="text-3xl font-bold text-[#003B79] mt-1">{analytics.todayViews}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Seitenaufrufe gesamt</p>
            <p className="text-3xl font-bold text-[#003B79] mt-1">{analytics.totalViews}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Downloads gesamt</p>
            <p className="text-3xl font-bold text-[#003B79] mt-1">{analytics.totalDownloads}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Absendungen gesamt</p>
            <p className="text-3xl font-bold text-[#003B79] mt-1">{totalAll}</p>
          </div>
        </div>
      )}

      {/* Page views by page + Referrers */}
      {analytics && (
        <div className="grid lg:grid-cols-2 gap-6">
          <CollapsibleSection title="Aufrufe je Seite (30 Tage)" defaultOpen={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Seite</th>
                    <th className="px-5 py-3 font-medium text-right">Aufrufe</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.viewsByPage.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-5 py-8 text-center text-slate-500">Noch keine Daten.</td>
                    </tr>
                  )}
                  {analytics.viewsByPage.map((row) => (
                    <tr key={row.path} className="border-t border-slate-100">
                      <td className="px-5 py-3 font-mono text-sm text-slate-700">{row.path}</td>
                      <td className="px-5 py-3 text-right font-semibold text-[#003B79]">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Referrer (30 Tage)" defaultOpen={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Quelle</th>
                    <th className="px-5 py-3 font-medium text-right">Aufrufe</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.referrers.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-5 py-8 text-center text-slate-500">Keine Referrer erfasst.</td>
                    </tr>
                  )}
                  {analytics.referrers.map((row) => (
                    <tr key={row.referrer} className="border-t border-slate-100">
                      <td className="px-5 py-3 text-slate-700">{row.referrer}</td>
                      <td className="px-5 py-3 text-right font-semibold text-[#003B79]">{row.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Downloads */}
      {analytics && (
        <CollapsibleSection title="Flyer-Downloads" defaultOpen={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Datei</th>
                  <th className="px-5 py-3 font-medium text-right">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {analytics.downloads.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-5 py-8 text-center text-slate-500">Noch keine Downloads.</td>
                  </tr>
                )}
                {analytics.downloads.map((row) => (
                  <tr key={row.file} className="border-t border-slate-100">
                    <td className="px-5 py-3 text-slate-700">{row.file}</td>
                    <td className="px-5 py-3 text-right font-semibold text-[#003B79]">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      )}

      {/* Submission KPIs */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Absendungen gesamt</p>
          <p className="text-3xl font-bold text-[#003B79] mt-1">{totalAll}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Partner mit Anfragen</p>
          <p className="text-3xl font-bold text-[#003B79] mt-1">{totalsByPartner.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Letzte Einträge</p>
          <p className="text-3xl font-bold text-[#003B79] mt-1">{recent.length}</p>
        </div>
      </div>

      <CollapsibleSection title="Neueste Anfragen">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Zeit</th>
                <th className="px-5 py-3 font-medium">Firma</th>
                <th className="px-5 py-3 font-medium">PLZ</th>
                <th className="px-5 py-3 font-medium">Partner</th>
                <th className="px-5 py-3 font-medium">Mail</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString("de-DE")}
                  </td>
                  <td className="px-5 py-3">{row.company}</td>
                  <td className="px-5 py-3 font-mono">{row.plz}</td>
                  <td className="px-5 py-3">
                    {(row.partner_slugs || []).map((s: string) => names[s] || s).join(", ")}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {row.mail_status ? JSON.stringify(row.mail_status) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Absendungen je Partner" defaultOpen={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Partner</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium text-right">Anzahl</th>
              </tr>
            </thead>
            <tbody>
              {totalsByPartner.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-slate-500">
                    Noch keine Absendungen vorhanden.
                  </td>
                </tr>
              )}
              {totalsByPartner.map(([slug, count]) => (
                <tr key={slug} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-800">{names[slug] || slug}</td>
                  <td className="px-5 py-3 text-slate-500 font-mono text-xs">{slug}</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#003B79]">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Monatliche Statistik" defaultOpen={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Monat</th>
                <th className="px-5 py-3 font-medium">Partner</th>
                <th className="px-5 py-3 font-medium text-right">Anzahl</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-slate-500">Keine Monatsdaten.</td>
                </tr>
              )}
              {stats.map((row, i) => (
                <tr key={`${row.month}-${row.partner_slug}-${i}`} className="border-t border-slate-100">
                  <td className="px-5 py-3">{new Date(row.month).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</td>
                  <td className="px-5 py-3">{names[row.partner_slug] || row.partner_slug}</td>
                  <td className="px-5 py-3 text-right font-semibold">{row.submission_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </div>
  )
}
