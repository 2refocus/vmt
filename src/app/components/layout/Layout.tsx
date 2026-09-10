import { useEffect, useMemo, useState } from "react"
import { Outlet, Link, useLocation } from "react-router"
import { Info, Users, Briefcase, Menu, Mail, Share2, Linkedin } from "lucide-react"
import { cn } from "../../../lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { SeoMeta } from "../SeoMeta"
import vmtLogo from "../../../imports/vmt-logo-01.svg"
import dticketWhite from "../../../imports/dticket_white.svg"
import logosVerbund from "../../../imports/logos_verbund_icon_only.png"

const companyLinks = [
  { to: "/company#benefits", label: "Vorteile" },
  { to: "/company#conditions", label: "Konditionen" },
  { to: "/company#rechenbeispiel", label: "Rechenbeispiel" },
  { to: "/company#how-it-works", label: "So funktioniert's" },
] as const

const SHARE_TEXT =
  "Das Deutschlandticket Job – attraktiver Benefit für Beschäftigte und Unternehmen:"

function getShareUrl(pathname: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${pathname}`
  }
  return `https://das-kommt-gut-an.de${pathname}`
}

function buildShareLinks(url: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(`${SHARE_TEXT} ${url}`)
  return {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent("Deutschlandticket Job")}&body=${encodedText}`,
  }
}

async function handleNativeShare(url: string) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: "Deutschlandticket Job",
        text: SHARE_TEXT,
        url,
      })
      return true
    } catch {
      return false
    }
  }
  return false
}

export function Layout() {
  const location = useLocation()
  const isHome = location.pathname === "/"
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = useMemo(
    () => getShareUrl(location.pathname + location.hash),
    [location.pathname, location.hash]
  )
  const shareLinks = useMemo(() => buildShareLinks(shareUrl), [shareUrl])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 80)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.pathname, location.hash])

  const onShare = async () => {
    const shared = await handleNativeShare(shareUrl)
    if (shared) {
      setMenuOpen(false)
      return
    }
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.open(shareLinks.whatsapp, "_blank", "noreferrer")
    }
    setMenuOpen(false)
  }

  const getBgColor = () => {
    if (location.pathname.startsWith("/employee")) return "bg-white text-[#003B79] border-b border-[#A3C410]/20"
    return "bg-white text-[#003B79] border-b border-[#003B79]/10"
  }

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2 transition-colors",
      active ? "text-[#003B79] underline underline-offset-4" : "text-slate-600 hover:text-[#003B79]",
    )

  const mobileLinkClass =
    "block rounded-lg px-3 py-2.5 text-base font-medium text-[#003B79] hover:bg-[#003B79]/5 transition-colors"
  const mobileSubLinkClass =
    "block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#003B79] transition-colors"

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <SeoMeta />
      {!isHome && (
        <header className={cn("sticky top-0 z-50 w-full", getBgColor())}>
          <div className="container mx-auto px-3 sm:px-0 h-20 pt-2 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-8 group">
              <img src={vmtLogo} alt="VMT Logo" className="h-12 w-auto py-1" />
              <div className="hidden sm:flex items-center gap-4 self-center">
                <img
                  src={logosVerbund}
                  alt="Logos Verbund"
                  className="max-h-10 h-auto w-auto shrink-0 object-contain rounded bg-white p-2"
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 font-medium">
              <Link
                to="/company"
                className={linkClass(location.pathname.startsWith("/company"))}
              >
                <Briefcase className="w-4 h-4" />
                <span>Für Unternehmen</span>
              </Link>
              <Link
                to="/employee"
                className={linkClass(location.pathname.startsWith("/employee"))}
              >
                <Users className="w-4 h-4" />
                <span>Für Angestellte</span>
              </Link>
              <Link to="/faq" className={linkClass(location.pathname === "/faq")}>
                <Info className="w-4 h-4" />
                <span>FAQ</span>
              </Link>
              <Link
                to="/lookup"
                className={linkClass(location.pathname.startsWith("/lookup") || location.pathname.startsWith("/apply"))}
              >
                <Mail className="w-4 h-4" />
                <span>Kontakt + Verbundpartner</span>
              </Link>
            </nav>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-[#003B79] hover:bg-[#003B79]/5 transition-colors"
                  aria-label="Menü öffnen"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white w-[min(100%,20rem)] p-0">
                <SheetHeader className="border-b border-slate-100 px-4 py-5 text-left">
                  <SheetTitle className="text-[#003B79]">Menü</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-3 py-4">
                  <Link to="/company" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                    Für Unternehmen
                  </Link>
                  <div className="ml-2 mb-2 flex flex-col gap-0.5 border-l border-slate-200 pl-2">
                    {companyLinks.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={mobileSubLinkClass}
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <Link to="/employee" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                    Für Angestellte
                  </Link>
                  <Link to="/faq" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                    FAQ
                  </Link>
                  <Link to="/lookup" className={mobileLinkClass} onClick={() => setMenuOpen(false)}>
                    Kontakt + Verbundpartner
                  </Link>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="px-3 mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Teilen
                    </p>
                    <button type="button" className={`${mobileLinkClass} w-full text-left`} onClick={onShare}>
                      <span className="inline-flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        {copied ? "Link kopiert" : "Seite teilen"}
                      </span>
                    </button>
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className={mobileSubLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      WhatsApp
                    </a>
                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className={mobileSubLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      LinkedIn
                    </a>
                    <a
                      href={shareLinks.email}
                      className={mobileSubLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      E-Mail
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      {!isHome && (
        <footer className="bg-[#003B79] text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-start gap-8 mb-6">
                  <img src={vmtLogo} alt="VMT Logo" className="h-10 w-auto brightness-0 invert" />
                  <img
                    src={dticketWhite}
                    alt="Deutschlandticket Job"
                    className="h-12 w-auto shrink-0 object-contain ml-4 mb-2"
                  />
                </div>
                <p className="text-white/70 max-w-sm">
                  Die smarte Mobilitätslösung für Unternehmen und Beschäftigte. Einfach, nachhaltig und kosteneffizient.
                </p>
                <div className="mt-6">
                  <p className="text-sm font-medium text-white/80 mb-3">Seite teilen</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onShare}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      {copied ? "Link kopiert" : "Teilen"}
                    </button>
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                    <a
                      href={shareLinks.email}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      E-Mail
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-lg">Links</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <Link to="/company" className="hover:text-white transition-colors">
                      Für Unternehmen
                    </Link>
                  </li>
                  <li>
                    <Link to="/employee" className="hover:text-white transition-colors">
                      Für Angestellte
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="hover:text-white transition-colors">
                      Häufige Fragen (FAQ)
                    </Link>
                  </li>
                  <li>
                    <Link to="/lookup" className="hover:text-white transition-colors">
                      Jobticket beantragen
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-lg">Rechtliches</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <a
                      href="https://www.vmt-thueringen.de/impressum/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Impressum
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.vmt-thueringen.de/datenschutz/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Datenschutz
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.vmt-thueringen.de/barrierefreiheit/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Barrierefreiheit
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/50 text-sm">
              &copy; {new Date().getFullYear()} VMT
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
