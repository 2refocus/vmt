import { Link, useSearchParams } from "react-router"
import { CheckCircle2, ArrowRight, Mail, Calendar, Phone } from "lucide-react"
import { Button } from "../components/ui/button"

export default function Success() {
  const [searchParams] = useSearchParams();
  const selectedPartners = (searchParams.get("partners") || "")
    .split(",")
    .filter(Boolean);
  const partnerCount = selectedPartners.length;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-[#A3C410] p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/2 w-full h-full bg-white rounded-full mix-blend-overlay filter blur-[50px] transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-[#A3C410]" />
              </div>
              <h1 className="text-4xl font-bold text-[#003B79] mb-4">Vielen Dank!</h1>
              <p className="text-xl text-[#003B79]/80 font-medium">
                {partnerCount > 1
                  ? `Ihre Anfrage wurde erfolgreich an ${partnerCount} ausgewählte Verbundpartner übermittelt.`
                  : "Ihre Anfrage wurde erfolgreich an den Verbundpartner übermittelt."}
              </p>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Wie geht es jetzt weiter?</h3>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#003B79]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[#003B79]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003B79]">1. Bestätigungsemail</h4>
                  <p className="text-slate-600 mt-1">
                    Sie erhalten in Kürze eine Bestätigungsemail mit der Zusammenfassung Ihrer Angaben.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#003B79]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[#003B79]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003B79]">2. Kontaktaufnahme</h4>
                  <p className="text-slate-600 mt-1">
                    Ihr lokaler Verbundpartner wird sich innerhalb der nächsten 1-2 Werktage bei Ihnen melden, um die Details und Vertragsunterlagen zu besprechen.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-[#003B79]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#003B79]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#003B79]">3. Startschuss</h4>
                  <p className="text-slate-600 mt-1">
                    Nach Vertragsabschluss können Ihre Mitarbeitenden das Deutschlandticket Job sofort über unser Portal oder die App bestellen.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-slate-200" asChild>
                <Link to="/">Zur Startseite</Link>
              </Button>
              <Button className="bg-[#003B79] text-white hover:bg-[#003B79]/90" asChild>
                <Link to="/faq">
                  Häufige Fragen (FAQ) lesen
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
