import { useEffect } from "react"
import { useLocation } from "react-router"

const SITE_URL = "https://das-kommt-gut-an.de"
const SITE_NAME = "Deutschlandticket Job | VMT"

type PageSeo = {
  title: string
  description: string
  image: string
  path: string
}

const DEFAULT_SEO: PageSeo = {
  title: "Deutschlandticket Job – Kommt gut an | VMT",
  description:
    "Das Deutschlandticket Job für Unternehmen und Beschäftigte im Verkehrsverbund Mittelthüringen. Mindestens 30 % günstiger mobil – einfach, nachhaltig und kosteneffizient.",
  image: `${SITE_URL}/og/og-default.jpg`,
  path: "/",
}

const SEO_BY_PATH: Record<string, Omit<PageSeo, "path">> = {
  "/": DEFAULT_SEO,
  "/company": {
    title: "Für Unternehmen – Deutschlandticket Job | VMT",
    description:
      "Mitarbeiterbonus, der ankommt: Bieten Sie Ihrem Team das Deutschlandticket Job und stärken Sie Ihre Arbeitgeberattraktivität.",
    image: `${SITE_URL}/og/og-company.jpg`,
  },
  "/employee": {
    title: "Für Angestellte – Deutschlandticket Job | VMT",
    description:
      "Clever pendeln und sparen: Mit dem Deutschlandticket Job mindestens 30 % günstiger deutschlandweit mobil – ohne Tarifstress.",
    image: `${SITE_URL}/og/og-employee.jpg`,
  },
  "/lookup": {
    title: "Verbundpartner finden – Deutschlandticket Job | VMT",
    description:
      "Finden Sie mit Ihrer Postleitzahl den zuständigen Verbundpartner und stellen Sie Ihre Anfrage zum Deutschlandticket Job.",
    image: `${SITE_URL}/og/og-default.jpg`,
  },
  "/faq": {
    title: "FAQ – Deutschlandticket Job | VMT",
    description:
      "Häufige Fragen zum Deutschlandticket Job für Unternehmen und Beschäftigte im VMT.",
    image: `${SITE_URL}/og/og-default.jpg`,
  },
  "/apply": {
    title: "Anfrage stellen – Deutschlandticket Job | VMT",
    description:
      "Stellen Sie Ihre Anfrage zum Deutschlandticket Job – wir leiten sie an den zuständigen Verbundpartner weiter.",
    image: `${SITE_URL}/og/og-default.jpg`,
  },
  "/success": {
    title: "Anfrage gesendet – Deutschlandticket Job | VMT",
    description: "Ihre Anfrage zum Deutschlandticket Job wurde erfolgreich übermittelt.",
    image: `${SITE_URL}/og/og-default.jpg`,
  },
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement("meta")
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute("content", content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement("link")
    el.setAttribute("rel", rel)
    document.head.appendChild(el)
  }
  el.setAttribute("href", href)
}

export function SeoMeta() {
  const location = useLocation()

  useEffect(() => {
    const basePath = "/" + location.pathname.split("/").filter(Boolean)[0]
    const pathKey = location.pathname === "/" ? "/" : basePath
    const page = SEO_BY_PATH[pathKey] || DEFAULT_SEO
    const url = `${SITE_URL}${location.pathname === "/" ? "" : location.pathname}`

    document.title = page.title
    document.documentElement.lang = "de"

    upsertMeta("name", "description", page.description)
    upsertMeta("name", "theme-color", "#003B79")

    upsertMeta("property", "og:type", "website")
    upsertMeta("property", "og:site_name", SITE_NAME)
    upsertMeta("property", "og:locale", "de_DE")
    upsertMeta("property", "og:title", page.title)
    upsertMeta("property", "og:description", page.description)
    upsertMeta("property", "og:url", url)
    upsertMeta("property", "og:image", page.image)
    upsertMeta("property", "og:image:width", "1200")
    upsertMeta("property", "og:image:height", "630")
    upsertMeta("property", "og:image:alt", page.title)

    upsertMeta("name", "twitter:card", "summary_large_image")
    upsertMeta("name", "twitter:title", page.title)
    upsertMeta("name", "twitter:description", page.description)
    upsertMeta("name", "twitter:image", page.image)

    upsertLink("canonical", url)
  }, [location.pathname])

  return null
}
