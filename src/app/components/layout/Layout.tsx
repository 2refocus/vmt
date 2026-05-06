import { useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router"
import { Train, Info, Users, Briefcase } from "lucide-react"
import { cn } from "../../../lib/utils"
import { Button } from "../ui/button"
import vmtLogo from "../../../imports/vmt-logo-01.svg"
import logosVerbund from "../../../imports/logos_verbund.png"

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Different headers depending on route
  const getNavColor = () => {
    if (location.pathname.startsWith('/employee')) return 'text-[#A3C410] hover:text-[#003B79]';
    return 'text-[#003B79] hover:opacity-80';
  }

  const getBgColor = () => {
    if (location.pathname.startsWith('/employee')) return 'bg-white text-[#003B79] border-b border-[#A3C410]/20';
    return 'bg-white text-[#003B79] border-b border-[#003B79]/10';
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {!isHome && (
        <header className={cn("sticky top-0 z-50 w-full", getBgColor())}>
          <div className="container mx-auto px-3 sm:px-0 h-20 pt-2 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-8 group">
              <img src={vmtLogo} alt="VMT Logo" className="h-12 w-auto py-1" />
              <div className="hidden sm:flex items-center gap-4 self-center">
                <img src={logosVerbund} alt="Logos Verbund" className="h-14 w-auto object-right rounded bg-white p-2" />
              </div>
            </Link>
            
            <nav className="flex items-center gap-6 font-medium">
              <Link to="/company" className={cn("flex items-center gap-2 transition-colors", 
                location.pathname.startsWith('/company') ? 'text-[#003B79] underline underline-offset-4' : 'text-slate-600 hover:text-[#003B79]')}>
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Für Unternehmen</span>
              </Link>
              <Link to="/employee" className={cn("flex items-center gap-2 transition-colors", 
                location.pathname.startsWith('/employee') ? 'text-[#003B79] underline underline-offset-4' : 'text-slate-600 hover:text-[#003B79]')}>
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Für Beschäftigte</span>
              </Link>
              <Link to="/faq" className={cn("flex items-center gap-2 transition-colors", 
                location.pathname === '/faq' ? 'text-[#003B79] underline underline-offset-4' : 'text-slate-600 hover:text-[#003B79]')}>
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">FAQ</span>
              </Link>
            </nav>
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
                <div className="flex items-start gap-8 mb-4">
                  <img src={vmtLogo} alt="VMT Logo" className="h-10 w-auto brightness-0 invert" />
                  <span className="mt-0 font-bold text-lg tracking-tight">
                    Deutschlandticket <span className="text-[#A3C410]">Job</span>
                  </span>
                </div>
                <p className="text-white/70 max-w-sm">
                  Die smarte Mobilitätslösung für Unternehmen und Beschäftigte. Einfach, nachhaltig und kosteneffizient.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-lg">Links</h4>
                <ul className="space-y-2 text-white/70">
                  <li><Link to="/company" className="hover:text-white transition-colors">Für Unternehmen</Link></li>
                  <li><Link to="/employee" className="hover:text-white transition-colors">Für Beschäftigte</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">Häufige Fragen (FAQ)</Link></li>
                  <li><Link to="/lookup" className="hover:text-white transition-colors">Jobticket beantragen</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-lg">Rechtliches</h4>
                <ul className="space-y-2 text-white/70">
                  <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">AGB</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/50 text-sm">
              &copy; {new Date().getFullYear()} Deutschlandticket Job
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
