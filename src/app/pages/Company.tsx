import { useState } from "react"
import { Link } from "react-router"
import { ArrowRight, CheckCircle2, Building, TrendingUp, HandCoins, PiggyBank, MapPin, Phone, ChevronDown } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "../components/ui/button"
import heroImg from "../../imports/vmt_visual_ma_bonus_b2b.jpg"
import dticketLogo from "../../imports/dticket.svg"

const COMPANY_FAQS = [
  {
    question: "Welche Unternehmen mitmachen können",
    answer:
      "Grundsätzlich kann jedes Unternehmen teilnehmen. Voraussetzung ist lediglich, dass mindestens zwei Arbeitnehmer*innen Ihres Unternehmens das Jobticket abnehmen und Sie als Arbeitgeber einen Zuschuss von mindestens 25 % (auf den rabattierten Ticketpreis) gewähren.",
  },
  {
    question: "Wie die Mitarbeitenden Ihres Unternehmens Ihr Deutschlandticket Job bestellen",
    answer:
      "Nach Vertragsabschluss mit Ihrem Verbundpartner erhalten Ihre Mitarbeitenden einen Zugang über Link oder Code. Darüber können sie das Deutschlandticket Job digital bestellen – in der Regel direkt als App-Ticket.",
  },
  {
    question: "Wie abgerechnet wird",
    answer:
      "Die Abrechnung erfolgt in der Regel monatlich über den gewählten Verbundpartner. Sie erhalten eine gesammelte Rechnung über alle aktiven Tickets Ihrer Mitarbeitenden abzüglich Ihres Arbeitgeberzuschusses. Der Betrag für die Mitarbeitenden wird bei diesen in der Regel direkt über die Lohnabrechnung einbehalten.",
  },
]

const TICKET_PRICE = 63
const DISCOUNT_RATE = 0.05
const SUBSIDY_OPTIONS = [25, 50, 75] as const

type SubsidyPercent = (typeof SUBSIDY_OPTIONS)[number]

function formatEuro(value: number) {
  return (
    value.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " €"
  )
}

export default function Company() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [subsidyPercent, setSubsidyPercent] = useState<SubsidyPercent>(25)

  const discountAmount = TICKET_PRICE * DISCOUNT_RATE
  const subsidyAmount = TICKET_PRICE * (subsidyPercent / 100)
  const employeePrice = TICKET_PRICE - subsidyAmount - discountAmount

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-[#003B79] text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
           <img 
             src={heroImg} 
             alt="Mitarbeiterbonus. Kommt gut an." 
             className="absolute top-0 h-full w-[145%] max-w-none object-cover object-[0%_40%] md:left-[10%] left-0 opacity-60"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[#003B79]/88 via-[#003B79]/72 to-[#003B79]/52" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <img
              src={dticketLogo}
              alt="Deutschlandticket Job"
              className="h-14 md:h-16 w-auto mb-6 md:hidden"
            />
            <div className="inline-block px-4 py-1.5 bg-[#A3C410] text-[#003B79] font-bold rounded-full mb-6 text-sm">
              Für Unternehmen
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              <span className="text-[#A3C410]">Mitarbeiterbonus.</span><br />
              Kommt gut an.
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed font-light">
              Das Deutschlandticket Job entlastet Ihre Angestellten bei den Mobilitätskosten und bietet einen attraktiven Benefit mit Mehrwert im Alltag.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 text-lg h-14 px-8" asChild>
                <a href="#how-it-works">So funktioniert's</a>
              </Button>
              <Button size="lg" className="bg-[#A3C410] text-[#003B79] hover:bg-white text-lg h-14 px-8" asChild>
                <Link to="/lookup">
                  Jetzt Kontakt aufnehmen
                </Link>
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

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B79] mb-4">
              Ihre Vorteile auf einen Blick
            </h2>
            <p className="text-lg text-slate-600">
              Mit dem Deutschlandticket Job bieten Sie Ihren Angestellten einen attraktiven Benefit und unterstützen sie bei ihren täglichen Mobilitätskosten.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Mitarbeiterbonus mit Alltagsnutzen",
                desc: "Bieten Sie Ihrem Team einen finanziellen Vorteil, von dem Ihre Angestellten jeden Monat profitieren."
              },
              {
                icon: Building,
                title: "Arbeitgeberattraktivität stärken",
                desc: "Ein attraktiver Zusatzbenefit kann dabei unterstützen, Angestellte zu binden und neue Mitarbeitende für Ihr Unternehmen zu gewinnen."
              },
              {
                icon: HandCoins,
                title: "Wertschätzung zeigen",
                desc: "Mit Ihrem Zuschuss unterstützen Sie die Mobilität Ihrer Angestellten und zeigen Wertschätzung, die im Alltag spürbar wird."
              },
              {
                icon: PiggyBank,
                title: "Sozialabgaben sparen",
                desc: "Unter bestimmten Voraussetzungen kann der Zuschuss zum Deutschlandticket Job steuer- und sozialversicherungsfrei gewährt werden."
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

      {/* Conditions */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B79] mb-4">
              Die Konditionen des Deutschlandticket Job
            </h2>
            <p className="text-lg text-slate-600">
              Mit dem Deutschlandticket Job bieten Sie Ihren Angestellten deutschlandweite Mobilität zu vergünstigten Konditionen.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-10">
            <div>
              <h3 className="text-2xl font-bold text-[#003B79] mb-6">So funktioniert das Modell</h3>
              <ul className="space-y-4">
                {[
                  "regulärer Preis des Deutschlandtickets: 63 € pro Monat",
                  "Sie bezuschussen das Ticket mit mindestens 25 % des regulären Ticketpreises",
                  "dadurch wird zusätzlich ein Rabatt von 5 % auf das Deutschlandticket gewährt",
                  "für Ihre Beschäftigten kostet das Deutschlandticket Job damit maximal 44,10 € pro Monat",
                  "Sie können freiwillig einen höheren Zuschuss übernehmen und den Eigenanteil Ihrer Beschäftigten weiter reduzieren",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#A3C410] shrink-0 mt-0.5" />
                    <span className="text-slate-700 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-2xl font-bold text-[#003B79] mb-4">Deutschlandweit gültig</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Das Deutschlandticket Job gilt deutschlandweit im teilnehmenden öffentlichen Nahverkehr – in Bussen, Straßenbahnen und U-Bahnen sowie in Nahverkehrszügen der 2. Klasse.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Das Ticket ist personengebunden und nicht übertragbar. Eine Mitnahme weiterer Personen, von Fahrrädern oder Hunden ist nicht automatisch enthalten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Process Table */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-100">
              <h2 className="text-3xl font-bold text-[#003B79] mb-2">Das Rechenbeispiel</h2>
              <p className="text-sm text-slate-500 mb-6">Stand 2026</p>
              <p className="text-slate-600 mb-6">
                So setzt sich der Preis zusammen – wählen Sie Ihren Unternehmenszuschuss:
              </p>

              <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Unternehmenszuschuss wählen">
                {SUBSIDY_OPTIONS.map((percent) => {
                  const isActive = subsidyPercent === percent
                  return (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => setSubsidyPercent(percent)}
                      className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-colors ${
                        isActive
                          ? "bg-[#003B79] text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {percent} % Zuschuss
                    </button>
                  )
                })}
              </div>
              
              {/* Mobile: stacked rows */}
              <div className="space-y-4 md:hidden">
                {[
                  { label: "Deutschlandticket", value: formatEuro(TICKET_PRICE), valueClass: "text-slate-900" },
                  { label: "Zuschuss Unternehmen", hint: `(${subsidyPercent} %)`, value: formatEuro(subsidyAmount), valueClass: "text-[#003B79]" },
                  { label: "5 % Rabatt", value: formatEuro(discountAmount), valueClass: "text-[#A3C410]" },
                  { label: "Preis für Mitarbeitende", hint: "pro Monat (max.)", value: formatEuro(employeePrice), valueClass: "text-slate-900", highlight: true },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`flex items-start justify-between gap-4 py-4 ${
                      row.highlight
                        ? "border-t-2 border-slate-200 pt-5"
                        : "border-b border-slate-100"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{row.label}</p>
                      {row.hint && (
                        <p className="text-sm font-normal text-slate-500 mt-0.5">{row.hint}</p>
                      )}
                    </div>
                    <p className={`font-bold text-xl shrink-0 tabular-nums ${row.valueClass}`}>{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="pb-4 font-semibold text-slate-900 align-top">Deutschlandticket</th>
                      <th className="pb-4 font-semibold text-slate-900 align-top">Zuschuss Unternehmen<br/><span className="text-sm font-normal text-slate-500">({subsidyPercent} %)</span></th>
                      <th className="pb-4 font-semibold text-slate-900 align-top">5 % Rabatt</th>
                      <th className="pb-4 font-semibold text-slate-900 align-top">Preis für Mitarbeitende<br/><span className="text-sm font-normal text-slate-500">pro Monat (max.)</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-6 font-bold text-xl text-slate-900 tabular-nums">{formatEuro(TICKET_PRICE)}</td>
                      <td className="py-6 font-bold text-xl text-[#003B79] tabular-nums">{formatEuro(subsidyAmount)}</td>
                      <td className="py-6 font-bold text-xl text-[#A3C410] tabular-nums">{formatEuro(discountAmount)}</td>
                      <td className="py-6 font-bold text-xl text-slate-900 tabular-nums">{formatEuro(employeePrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-[#003B79]/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl font-bold text-[#003B79] mb-2">Interesse geweckt?</h3>
                <p className="text-slate-600">Finden Sie mit Ihrer Postleitzahl den zuständigen Ansprechpartner für Ihre Region.</p>
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

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003B79] mb-4">So funktioniert&apos;s</h2>
          <p className="text-lg text-slate-600 mb-12">
            In wenigen Schritten zum Deutschlandticket Job.
          </p>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-slate-200 z-0" />

            {[
              {
                step: "1",
                title: "Kontakt aufnehmen",
                desc: "Finden Sie den zuständigen Ansprechpartner für Ihre Region.",
              },
              {
                step: "2",
                title: "Persönlich beraten lassen",
                desc: "Ihr Ansprechpartner klärt mit Ihnen die Voraussetzungen und begleitet Sie bei den nächsten Schritten.",
              },
              {
                step: "3",
                title: "Deutschlandticket Job einführen",
                desc: "Gemeinsam mit Ihrem Ansprechpartner setzen Sie die nächsten Schritte um und können das Deutschlandticket Job anschließend Ihren Mitarbeitern anbieten.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative z-10 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-[#A3C410] text-[#003B79] rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-[#003B79] mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <Button size="lg" className="mt-12 bg-[#003B79] text-white hover:bg-[#003B79]/90 text-lg h-14 px-8" asChild>
            <Link to="/lookup">
              Kontakt aufnehmen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#003B79] mb-8">Noch Fragen?</h2>
          <div className="grid gap-4 text-left max-w-2xl mx-auto mb-10">
            {COMPANY_FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i

              return (
                <div
                  key={i}
                  className={`rounded-xl border overflow-hidden transition-colors ${
                    isOpen ? "border-[#003B79]" : "border-slate-200 hover:border-[#003B79]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-4 flex items-center gap-3 text-left cursor-pointer group bg-white"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#A3C410] shrink-0" />
                    <span className="font-medium text-slate-700 group-hover:text-[#003B79] flex-1">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isOpen ? "rotate-180 bg-slate-100 text-slate-600" : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 pl-12 text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <Button variant="outline" className="text-[#003B79] border-[#003B79]" asChild>
            <Link to="/faq">Alle FAQs ansehen</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
