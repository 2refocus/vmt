import { supabase } from "./supabase"
import {
  PARTNERS,
  PLZ_TO_PARTNERS,
  type Partner,
  type PartnerSlug,
} from "../app/data/partners"

export type PartnerRow = {
  slug: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  website: string | null
  lat: number | null
  lng: number | null
  logo_key: string | null
  selectable: boolean
  sort_order: number
}

export type PartnersCatalog = {
  partners: Record<string, Partner>
  plzMap: Record<string, string[]>
  source: "supabase" | "static"
}

function staticCatalog(): PartnersCatalog {
  return {
    partners: { ...PARTNERS },
    plzMap: Object.fromEntries(
      Object.entries(PLZ_TO_PARTNERS).map(([plz, slugs]) => [plz, [...slugs]])
    ),
    source: "static",
  }
}

function rowToPartner(row: PartnerRow, logo?: string): Partner {
  return {
    slug: row.slug as PartnerSlug,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    address: row.address || undefined,
    website: row.website || undefined,
    coordinates:
      row.lat != null && row.lng != null ? [row.lat, row.lng] : undefined,
    logo,
  }
}

export async function loadPartnersCatalog(): Promise<PartnersCatalog> {
  if (!supabase) return staticCatalog()

  const [partnersRes, plzRes] = await Promise.all([
    supabase.from("partners").select("*").order("sort_order"),
    supabase.from("partner_plz").select("plz, partner_slug"),
  ])

  if (partnersRes.error || plzRes.error || !partnersRes.data?.length) {
    console.warn("Falling back to static partners:", partnersRes.error || plzRes.error)
    return staticCatalog()
  }

  const partners: Record<string, Partner> = {}
  for (const row of partnersRes.data as PartnerRow[]) {
    const staticLogo = PARTNERS[row.slug as PartnerSlug]?.logo
    // Prefer DB selectable flag via email null
    const partner = rowToPartner(row, staticLogo)
    if (!row.selectable) partner.email = null
    partners[row.slug] = partner
  }

  const plzMap: Record<string, string[]> = {}
  for (const row of plzRes.data as { plz: string; partner_slug: string }[]) {
    if (!plzMap[row.plz]) plzMap[row.plz] = []
    plzMap[row.plz].push(row.partner_slug)
  }

  return { partners, plzMap, source: "supabase" }
}

export function findPartnersInCatalog(
  catalog: PartnersCatalog,
  plz: string
): Partner[] {
  const normalized = plz.padStart(5, "0")
  const slugs = catalog.plzMap[normalized] || []
  return slugs.map((slug) => catalog.partners[slug]).filter(Boolean)
}

export async function listPartnerRows(): Promise<PartnerRow[]> {
  if (!supabase) throw new Error("Supabase nicht konfiguriert")
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("sort_order")
  if (error) throw error
  return (data || []) as PartnerRow[]
}

export async function listPlzForPartner(slug: string): Promise<string[]> {
  if (!supabase) throw new Error("Supabase nicht konfiguriert")
  const { data, error } = await supabase
    .from("partner_plz")
    .select("plz")
    .eq("partner_slug", slug)
    .order("plz")
  if (error) throw error
  return (data || []).map((r) => r.plz as string)
}

export async function upsertPartner(
  row: Omit<PartnerRow, "created_at" | "updated_at"> & { created_at?: string; updated_at?: string }
): Promise<void> {
  if (!supabase) throw new Error("Supabase nicht konfiguriert")
  const { error } = await supabase.from("partners").upsert({
    slug: row.slug,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    website: row.website,
    lat: row.lat,
    lng: row.lng,
    logo_key: row.logo_key,
    selectable: row.selectable,
    sort_order: row.sort_order,
  })
  if (error) throw error
}

export async function replacePartnerPlz(slug: string, plzList: string[]): Promise<void> {
  if (!supabase) throw new Error("Supabase nicht konfiguriert")
  const normalized = [...new Set(plzList.map((p) => p.trim().padStart(5, "0")).filter((p) => /^\d{5}$/.test(p)))]

  const { error: delError } = await supabase.from("partner_plz").delete().eq("partner_slug", slug)
  if (delError) throw delError

  if (normalized.length === 0) return
  const { error } = await supabase.from("partner_plz").insert(
    normalized.map((plz) => ({ plz, partner_slug: slug }))
  )
  if (error) throw error
}

export async function deletePartner(slug: string): Promise<void> {
  if (!supabase) throw new Error("Supabase nicht konfiguriert")
  const { error } = await supabase.from("partners").delete().eq("slug", slug)
  if (error) throw error
}

export type SubmissionStatRow = {
  month: string
  partner_slug: string
  submission_count: number
}

export async function fetchSubmissionStats(): Promise<SubmissionStatRow[]> {
  if (!supabase) throw new Error("Supabase nicht konfiguriert")
  const { data, error } = await supabase.from("submission_stats").select("*")
  if (error) throw error
  return (data || []) as SubmissionStatRow[]
}

export async function fetchRecentSubmissions(limit = 50) {
  if (!supabase) throw new Error("Supabase nicht konfiguriert")
  const { data, error } = await supabase
    .from("submissions")
    .select("id, created_at, company, plz, partner_slugs, email, mail_status")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}
