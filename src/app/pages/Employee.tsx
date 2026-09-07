import { Link } from "react-router"
import { ArrowRight, Leaf, Train, PiggyBank, Smile, CheckCircle2 } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "../components/ui/button"
import heroImg from "../../imports/vmt_visual_02_b2c.jpg"
import dticketLogo from "../../imports/dticket.svg"

export default function Employee() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-[#A3C410] text-[#003B79] md:min-h-[787px] md:flex md:items-center">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           <img 
             src={heroImg} 
             alt="Mehr Mobilität. Weniger Kosten." 
             className="w-full h-full object-cover object-[46%_30%] md:absolute md:inset-y-0 md:-left-[52%] md:w-[175%] md:max-w-none md:object-[70%_30%] opacity-60 mix-blend-overlay"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[#A3C410] via-[#A3C410]/95 to-[#A3C410]/50 md:via-[#A3C410]/80 md:to-[#A3C410]/35" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl pt-20 md:pt-0"
          >
            <img
              src={dticketLogo}
              alt="Deutschlandticket Job"
              className="h-14 md:h-16 w-auto mb-6 md:hidden"
            />
            <div className="inline-block px-4 py-1.5 bg-[#003B79] text-white font-bold rounded-full mb-6 text-sm">
              Für Angestellte
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Clever pendeln<br />
              und sparen.<br />
              <span className="text-white">Kommt gut an.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#003B79]/80 mb-10 leading-relaxed font-medium">
              Mindestens 30 % günstiger fahren. Einfach einsteigen, ankommen und profitieren. 
              Ohne Tarifstress und unabhängig von Spritpreisen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#003B79] text-white hover:bg-[#003B79]/90 text-lg h-14 px-8" asChild>
                <a href="#benefits">
                  Deine Vorteile entdecken
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="hidden md:flex justify-end items-center"
          >
            <img
              src={dticketLogo}
              alt="Deutschlandticket Job"
              className="max-w-md w-full h-auto"
            />
          </motion.div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="benefits" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[#003B79] mb-6">
              Deine Vorteile<br />
              auf einen Blick
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Mit dem Deutschlandticket Job sparst du jeden Monat bares Geld,<br />
              weil dein Arbeitgeber dir was dazu gibt.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: PiggyBank,
                title: "Geld sparen",
                desc: "Mit dem Arbeitgeberzuschuss zahlst du mindestens 30% weniger als für das reguläre Deutschlandticket",
              },
              {
                icon: Train,
                title: "Grenzenlos",
                desc: "Ein Ticket, unzählige Möglichkeiten: Nutze Busse, Straßenbahnen und Nahverkehrszüge deutschlandweit – ganz ohne Tarifgrenzen.",
              },
              {
                icon: Leaf,
                title: "Nachhaltig",
                desc: "Gut fürs Klima, gut für dich. Jede Fahrt mit Bus und Bahn statt mit dem Auto spart CO₂ und trägt zu einer klimafreundlicheren Mobilität bei.",
              },
              {
                icon: Smile,
                title: "Stressfrei",
                desc: "Keine Staus, keine Parkplatzsuche, keine Sorgen um steigende Benzinpreise – einfach einsteigen und entspannt ankommen.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-[#003B79]/10 text-[#003B79] rounded-xl flex items-center justify-center mb-6">
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#003B79] mb-3">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B79] mb-4">
              Die Konditionen des Deutschlandticket Job
            </h2>
            <p className="text-lg text-slate-600">
              Mit dem Deutschlandticket Job bist du deutschlandweit im Nahverkehr unterwegs und du zahlst weniger als für das reguläre Deutschlandticket.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-10">
            <div>
              <h3 className="text-2xl font-bold text-[#003B79] mb-6">Deine Vorteile auf einen Blick</h3>
              <ul className="space-y-4">
                {[
                  "maximal 44,10 € pro Monat statt regulär 63 €",
                  "dein Arbeitgeber übernimmt mindestens 25 % des regulären Ticketpreises",
                  "zusätzlich gibt es 5 % Rabatt auf das Deutschlandticket",
                  "monatlich kündbar",
                  "als digitales, personengebundenes Ticket erhältlich",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#A3C410] shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-[#003B79] mb-4">Wo gilt das Deutschlandticket Job?</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Du kannst deutschlandweit alle teilnehmenden Busse, Straßenbahnen, U-Bahnen sowie Nahverkehrszüge in der 2. Klasse nutzen, zum Beispiel S-Bahn, RB, RE und IRE.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Nicht enthalten sind grundsätzlich Fahrten im Fernverkehr wie IC, EC oder ICE sowie bestimmte touristische Verkehre. Auch die Mitnahme weiterer Personen, von Fahrrädern oder Hunden ist nicht automatisch enthalten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to get it */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003B79] mb-12">Wie bekomme ich das Ticket?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            {[
              { step: "1", title: "Chef fragen", desc: "Sprich mit deiner Personalabteilung oder deinem Chef." },
              { step: "2", title: "Zuschuss sichern", desc: "Arbeitgeber zahlt mindestens 25% vom Ticketpreis." },
              { step: "3", title: "Losfahren", desc: "Ticket erhalten und deutschlandweit im Nah- und Regionalverkehr nutzen." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-12 h-12 bg-[#A3C410] text-[#003B79] rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">
                  {step.step}
                </div>
                <h3 className="font-bold text-xl text-[#003B79] mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-[#003B79] mb-4">Chef, wir müssen reden!</h3>
            <p className="text-slate-600 mb-6">
              Dein Unternehmen bietet das Deutschlandticket Job noch nicht an? Sprich das Thema einfach an und zeig, welche Vorteile das Deutschlandticket Job für Beschäftigte und Unternehmen bietet.
            </p>
            <Button className="bg-[#003B79] text-white hover:bg-[#003B79]/90" asChild>
              <Link to="/company">
                Info-Seite für Arbeitgeber zeigen
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
