import { Link } from "react-router"
import { ArrowRight, CheckCircle2, Building, TrendingUp, HandCoins, MapPin, Phone } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "../components/ui/button"
import heroImg from "../../imports/AdobeStock_232967360_Preview.jpg"

export default function Company() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-[#003B79] text-white">
        <div className="absolute inset-0 z-0">
           <img 
             src={heroImg} 
             alt="Mehr fürs Team. Weniger Kosten." 
             className="w-full h-full object-cover object-top md:object-right-bottom scale-105 opacity-60"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[#003B79]/88 via-[#003B79]/72 to-[#003B79]/52" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-block px-4 py-1.5 bg-[#A3C410] text-[#003B79] font-bold rounded-full mb-6 text-sm">
              Für Arbeitgeber (B2B)
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Mehr fürs Team.<br />
              <span className="text-[#A3C410]">Weniger Kosten.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed font-light">
              Mit dem Deutschlandticket Job stärken Sie Ihre Arbeitgeberattraktivität 
              und bieten Ihrem Team einen echten Mehrwert im Alltag.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#A3C410] text-[#003B79] hover:bg-white text-lg h-14 px-8" asChild>
                <Link to="/lookup">
                  Jetzt Jobticket beantragen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 text-lg h-14 px-8" asChild>
                <a href="#how-it-works">So funktioniert's</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B79] mb-4">
              Ihre Investition auf einen Blick
            </h2>
            <p className="text-lg text-slate-600">
              Sie bieten mehr – Ihre Mitarbeitenden zahlen weniger. 
              Mit Ihrem Zuschuss fährt Ihr Team spürbar günstiger.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Arbeitgeberattraktivität",
                desc: "Steigern Sie Ihre Anziehungskraft auf Talente und stärken Sie die Mitarbeiterbindung nachhaltig."
              },
              {
                icon: Building,
                title: "Wettbewerbsfähigkeit",
                desc: "Positionieren Sie sich als moderner Arbeitgeber mit Fokus auf nachhaltige Mobilität."
              },
              {
                icon: HandCoins,
                title: "Planbare Kosten",
                desc: "Profitieren Sie von einer transparenten, kontrollierbaren Kostenstruktur ohne böse Überraschungen."
              }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100"
              >
                <div className="w-14 h-14 bg-[#003B79]/10 text-[#003B79] rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#003B79] mb-3">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Process Table */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-100">
              <h2 className="text-3xl font-bold text-[#003B79] mb-6">Das Rechenbeispiel (Stand 2026)</h2>
              <p className="text-slate-600 mb-8">
                Voraussetzung: Mindestens zwei Arbeitnehmer*innen Ihres Unternehmens müssen das Jobticket abnehmen.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="pb-4 font-semibold text-slate-900">Deutschlandticket</th>
                      <th className="pb-4 font-semibold text-slate-900">5 % Rabatt</th>
                      <th className="pb-4 font-semibold text-slate-900">Zuschuss Arbeitgeber<br/><span className="text-sm font-normal text-slate-500">(mind. 25 %)</span></th>
                      <th className="pb-4 font-semibold text-slate-900">Preis für Mitarbeitende<br/><span className="text-sm font-normal text-slate-500">pro Monat (max.)</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-6 font-bold text-xl text-slate-900">63,00 €</td>
                      <td className="py-6 font-bold text-xl text-[#A3C410]">3,15 €</td>
                      <td className="py-6 font-bold text-xl text-[#003B79]">15,75 €</td>
                      <td className="py-6 font-bold text-xl text-slate-900">44,10 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-[#003B79]/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold text-[#003B79] mb-2">Bereit für den Start?</h3>
                <p className="text-slate-600">Finden Sie den passenden Verbundpartner in Ihrer Region.</p>
              </div>
              <Button size="lg" className="bg-[#003B79] text-white hover:bg-[#003B79]/90 text-lg h-14 px-8 w-full md:w-auto" asChild>
                <Link to="/lookup">
                  Jetzt Verbundpartner finden
                  <MapPin className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#003B79] mb-8">Noch Fragen?</h2>
          <div className="grid gap-4 text-left max-w-2xl mx-auto mb-10">
            {[
              "Welche Unternehmen mitmachen können",
              "Wie die Mitarbeitenden Ihres Unternehmens Ihr Deutschlandticket Job bestellen",
              "Wie abgerechnet wird"
            ].map((q, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 hover:border-[#003B79] transition-colors flex items-center gap-3 cursor-pointer group">
                <CheckCircle2 className="w-5 h-5 text-[#A3C410]" />
                <span className="font-medium text-slate-700 group-hover:text-[#003B79]">{q}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="text-[#003B79] border-[#003B79]" asChild>
            <Link to="/faq">Alle FAQs ansehen</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
