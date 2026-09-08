import { useEffect, useState } from "react"
import { Outlet, Link, useLocation } from "react-router"
import { supabase } from "../../../lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { Button } from "../../components/ui/button"
import { LayoutDashboard, Users, LogOut } from "lucide-react"

export function AdminGuard() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)
    setError("")
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError(authError.message)
    setLoading(false)
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-600">
        Laden…
      </div>
    )
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <p className="text-red-600 max-w-md text-center">
          Supabase ist nicht konfiguriert. Bitte `VITE_SUPABASE_URL` und `VITE_SUPABASE_ANON_KEY` setzen.
        </p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded-xl p-8 w-full max-w-md space-y-4 border border-slate-200">
          <h1 className="text-2xl font-bold text-[#003B79]">Admin Login</h1>
          <p className="text-sm text-slate-500">Zugang für Partnerpflege und Absende-Übersicht.</p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#003B79]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Passwort</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-[#003B79]"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full bg-[#003B79] text-white" disabled={loading}>
            {loading ? "Anmelden…" : "Anmelden"}
          </Button>
          <p className="text-xs text-slate-400">
            Admin-User im Supabase Dashboard unter Authentication → Users anlegen (E-Mail bestätigt).
          </p>
        </form>
      </div>
    )
  }

  const navLink = (to: string, label: string, icon: React.ReactNode) => {
    const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to))
    return (
      <Link
        to={to}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active ? "bg-[#003B79] text-white" : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        {icon}
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-bold text-[#003B79]">VMT Admin</span>
            {navLink("/admin", "Dashboard", <LayoutDashboard className="w-4 h-4" />)}
            {navLink("/admin/partners", "Partner", <Users className="w-4 h-4" />)}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-slate-500">{session.user.email}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
