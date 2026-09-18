import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import {
  deletePartner,
  listPartnerRows,
  listPlzForPartner,
  replacePartnerPlz,
  upsertPartner,
  loadSiteSettings,
  saveSiteSetting,
  type PartnerRow,
  type SiteSetting,
} from "../../../lib/partners-api"

const emptyForm: PartnerRow = {
  slug: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  lat: null,
  lng: null,
  logo_key: "",
  selectable: true,
  sort_order: 100,
}

export default function AdminPartners() {
  const [rows, setRows] = useState<PartnerRow[]>([])
  const [form, setForm] = useState<PartnerRow>(emptyForm)
  const [plzText, setPlzText] = useState("")
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [settingsEdits, setSettingsEdits] = useState<Record<string, string>>({})
  const [savingSettings, setSavingSettings] = useState(false)

  const reload = async () => {
    const [data, siteSettings] = await Promise.all([listPartnerRows(), loadSiteSettings()])
    setRows(data)
    setSettings(siteSettings)
    setSettingsEdits(Object.fromEntries(siteSettings.map((s) => [s.key, s.value])))
  }

  useEffect(() => {
    ;(async () => {
      try {
        await reload()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Laden fehlgeschlagen")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const startEdit = async (row: PartnerRow) => {
    setEditing(true)
    setForm({ ...row })
    setMessage("")
    setError("")
    try {
      const plzs = await listPlzForPartner(row.slug)
      setPlzText(plzs.join(", "))
    } catch (err) {
      setError(err instanceof Error ? err.message : "PLZ laden fehlgeschlagen")
    }
  }

  const startCreate = () => {
    setEditing(true)
    setForm({ ...emptyForm })
    setPlzText("")
    setMessage("")
    setError("")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")
    try {
      const payload: PartnerRow = {
        ...form,
        slug: form.slug.trim().toLowerCase(),
        name: form.name.trim(),
        email: form.email?.trim() || null,
        phone: form.phone?.trim() || null,
        address: form.address?.trim() || null,
        website: form.website?.trim() || null,
        logo_key: form.logo_key?.trim() || null,
        selectable: form.email ? form.selectable : false,
      }
      if (!payload.slug || !payload.name) throw new Error("Slug und Name sind Pflichtfelder")
      await upsertPartner(payload)
      await replacePartnerPlz(
        payload.slug,
        plzText.split(/[\s,;]+/).filter(Boolean)
      )
      setMessage("Gespeichert.")
      await reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm(`Partner „${slug}“ wirklich löschen?`)) return
    try {
      await deletePartner(slug)
      if (form.slug === slug) {
        setEditing(false)
        setForm(emptyForm)
        setPlzText("")
      }
      await reload()
      setMessage("Partner gelöscht.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Löschen fehlgeschlagen")
    }
  }

  if (loading) return <p className="text-slate-600">Partner werden geladen…</p>

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#003B79]">Verbundpartner</h1>
          <p className="text-slate-600 mt-1">Adressen, E-Mails, Telefon und PLZ-Zuordnung pflegen.</p>
        </div>
        <Button type="button" className="bg-[#003B79] text-white" onClick={startCreate}>
          Neuer Partner
        </Button>
      </div>

      {message && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{message}</p>}
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">E-Mail</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.slug} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{row.name}</div>
                      <div className="text-xs font-mono text-slate-400">{row.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.email || <span className="text-amber-600">ohne E-Mail</span>}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button type="button" className="text-[#003B79] hover:underline mr-3" onClick={() => startEdit(row)}>
                        Bearbeiten
                      </button>
                      <button type="button" className="text-red-600 hover:underline" onClick={() => handleDelete(row.slug)}>
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {editing && (
          <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 h-fit">
            <h2 className="font-semibold text-[#003B79] text-lg">
              {form.slug && rows.some((r) => r.slug === form.slug) ? "Partner bearbeiten" : "Neuer Partner"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Slug">
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="input"
                  pattern="[a-z0-9-]+"
                  title="nur kleinbuchstaben, zahlen, bindestrich"
                />
              </Field>
              <Field label="Name">
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
              </Field>
              <Field label="E-Mail">
                <input type="email" value={form.email || ""} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" />
              </Field>
              <Field label="Telefon">
                <input value={form.phone || ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input" />
              </Field>
              <Field label="Adresse" className="sm:col-span-2">
                <input value={form.address || ""} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="input" />
              </Field>
              <Field label="Website" className="sm:col-span-2">
                <input value={form.website || ""} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} className="input" />
              </Field>
              <Field label="Sortierung">
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))}
                  className="input"
                />
              </Field>
              <Field label="Auswählbar">
                <label className="inline-flex items-center gap-2 h-10">
                  <input
                    type="checkbox"
                    checked={form.selectable}
                    onChange={(e) => setForm((f) => ({ ...f, selectable: e.target.checked }))}
                  />
                  <span className="text-sm text-slate-600">im Formular auswählbar</span>
                </label>
              </Field>
              <Field label="PLZ-Liste (kommagetrennt)" className="sm:col-span-2">
                <textarea
                  rows={5}
                  value={plzText}
                  onChange={(e) => setPlzText(e.target.value)}
                  className="input font-mono text-xs"
                  placeholder="99999, 99085, …"
                />
              </Field>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-[#003B79] text-white" disabled={saving}>
                {saving ? "Speichern…" : "Speichern"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                Abbrechen
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Testpartner: PLZ <span className="font-mono">99999</span> → Frank &amp; Haueis (andy@frank-haueis.de)
            </p>
          </form>
        )}
      </div>

      {/* Settings */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-[#003B79]">Einstellungen</h2>
        </div>
        <div className="p-5 space-y-4">
          {settings.map((s) => (
            <div key={s.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {s.label || s.key}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settingsEdits[s.key] ?? s.value}
                  onChange={(e) =>
                    setSettingsEdits((prev) => ({ ...prev, [s.key]: e.target.value }))
                  }
                  className="input flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="shrink-0"
                  disabled={savingSettings || settingsEdits[s.key] === s.value}
                  onClick={async () => {
                    setSavingSettings(true)
                    setError("")
                    try {
                      await saveSiteSetting(s.key, settingsEdits[s.key])
                      setMessage(`"${s.label || s.key}" gespeichert.`)
                      await reload()
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen")
                    } finally {
                      setSavingSettings(false)
                    }
                  }}
                >
                  {savingSettings ? "…" : "Speichern"}
                </Button>
              </div>
            </div>
          ))}
          {settings.length === 0 && (
            <p className="text-sm text-slate-500">Keine Einstellungen vorhanden.</p>
          )}
        </div>
      </section>

      <style>{`
        .input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; }
        .input:focus { border-color: #003B79; }
      `}</style>
    </div>
  )
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      {children}
    </label>
  )
}
