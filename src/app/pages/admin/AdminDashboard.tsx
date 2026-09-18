import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "../../components/ui/button"
import {
  fetchRecentSubmissions,
  fetchSubmissionStats,
  listPartnerRows,
  resetAllSubmissions,
} from "../../../lib/partners-api"

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ month: string; partner_slug: string; submission_count: number }[]>([])
  const [recent, setRecent] = useState<any[]>([])
  const [names, setNames] = useState<Record<string, string>>({})
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [resetting, setResetting] = useState(false)

  const loadDashboard = useCallback(async () => {
    const [s, r, partners] = await Promise.all([
      fetchSubmissionStats(),
      fetchRecentSubmissions(40),
      listPartnerRows(),
    ])
    setStats(s)
    setRecent(r)
    setNames(Object.fromEntries(partners.map((p) => [p.slug, p.name])))
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

    const typed = window.prompt('Zum Bestätigen bitte „RESET“ eingeben:')
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
        Löscht nur Formular-Absendungen. Partner und PLZ-Zuordnungen bleiben erhalten. Bestätigung: „RESET“.
      </p>

      {message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{message}</p>
      )}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

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

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-[#003B79]">Absendungen je Partner</h2>
        </div>
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
      </section>

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-[#003B79]">Monatliche Statistik</h2>
        </div>
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
      </section>

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-[#003B79]">Neueste Anfragen</h2>
        </div>
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
      </section>
    </div>
  )
}
