import { useState } from "react"
import { ChevronDown, Search, Building2, UserCircle2 } from "lucide-react"

const FAQS = [
  {
    target: "company",
    question: "Welche Unternehmen können beim Deutschlandticket Job mitmachen?",
    answer: "Grundsätzlich kann jedes Unternehmen teilnehmen. Voraussetzung ist lediglich, dass mindestens zwei Arbeitnehmer*innen Ihres Unternehmens das Jobticket abnehmen und Sie als Arbeitgeber einen Zuschuss von mindestens 25% (auf den rabattierten Ticketpreis) gewähren."
  },
  {
    target: "company",
    question: "Wie funktioniert die Abrechnung für mich als Arbeitgeber?",
    answer: "Die Abrechnung erfolgt in der Regel monatlich über den gewählten Verbundpartner. Sie erhalten eine gesammelte Rechnung über alle aktiven Tickets Ihrer Mitarbeitenden abzüglich Ihres Arbeitgeberzuschusses. Der Betrag für die Mitarbeitenden wird bei diesen in der Regel direkt über die Lohnabrechnung einbehalten."
  },
  {
    target: "company",
    question: "Gibt es steuerliche Vorteile für den Arbeitgeberzuschuss?",
    answer: "Ja. Der Arbeitgeberzuschuss zum Deutschlandticket Job ist in der Regel steuer- und sozialabgabenfrei, sofern er zusätzlich zum ohnehin geschuldeten Arbeitslohn gewährt wird."
  },
  {
    target: "employee",
    question: "Wie bestelle ich mein Deutschlandticket Job?",
    answer: "Sobald Ihr Arbeitgeber einen Vertrag mit einem Verbundpartner abgeschlossen hat, erhalten Sie einen speziellen Link oder Code. Darüber können Sie Ihr persönliches Ticket digital (meist als App-Ticket) bestellen."
  },
  {
    target: "employee",
    question: "Ist das Ticket auch in der Freizeit nutzbar?",
    answer: "Ja, uneingeschränkt! Das Deutschlandticket Job gilt rund um die Uhr in ganz Deutschland im Nah- und Regionalverkehr – egal ob für den Arbeitsweg, am Wochenende oder im Urlaub."
  },
  {
    target: "employee",
    question: "Was passiert, wenn ich das Unternehmen verlasse?",
    answer: "Wenn Sie aus dem Unternehmen ausscheiden, erlischt Ihre Berechtigung für das vergünstigte Deutschlandticket Job. Das Ticket wird dann zum Ende des Monats Ihres Ausscheidens gekündigt. Sie können danach privat ein reguläres Deutschlandticket abonnieren."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<"all" | "company" | "employee">("all");

  const filteredFaqs = FAQS.filter(faq => filter === "all" || faq.target === filter);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-[#003B79] pt-16 pb-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-1/2 left-1/2 w-full max-w-4xl h-[400px] bg-[#A3C410] rounded-full mix-blend-overlay filter blur-[100px] transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Häufige <span className="text-[#A3C410]">Fragen</span>
          </h1>
          <p className="text-xl text-white/80">
            Alle Antworten rund um das Deutschlandticket Job.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 max-w-4xl -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-8">
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button 
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                filter === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Alle Fragen
            </button>
            <button 
              onClick={() => setFilter("company")}
              className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all ${
                filter === "company" ? "bg-[#003B79] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Für Arbeitgeber
            </button>
            <button 
              onClick={() => setFilter("employee")}
              className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all ${
                filter === "employee" ? "bg-[#A3C410] text-[#003B79] shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <UserCircle2 className="w-4 h-4" />
              Für Beschäftigte
            </button>
          </div>

          {/* Accordion */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openIndex === i;
              const isCompany = faq.target === "company";
              
              return (
                <div 
                  key={i} 
                  className={`border rounded-xl overflow-hidden transition-all ${
                    isOpen ? (isCompany ? 'border-[#003B79]' : 'border-[#A3C410]') : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button 
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 bg-white"
                  >
                    <div className="flex flex-col gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block w-max ${
                        isCompany ? 'bg-[#003B79]/10 text-[#003B79]' : 'bg-[#A3C410]/20 text-[#003B79]'
                      }`}>
                        {isCompany ? 'Arbeitgeber' : 'Beschäftigte'}
                      </span>
                      <span className="font-bold text-slate-800 text-lg pr-4">{faq.question}</span>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-slate-100 text-slate-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 bg-white text-slate-600 leading-relaxed border-t border-slate-50 mt-2">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Keine Fragen für diese Kategorie gefunden.
            </div>
          )}

        </div>
        
        {/* Support Banner */}
        <div className="mt-8 bg-[#003B79]/5 rounded-2xl p-8 text-center border border-[#003B79]/10">
          <h3 className="text-lg font-bold text-[#003B79] mb-2">Ihre Frage war nicht dabei?</h3>
          <p className="text-slate-600 mb-6">Wir helfen Ihnen gerne persönlich weiter.</p>
          <a href="mailto:support@deutschlandticket-job.de" className="inline-flex items-center justify-center bg-white text-[#003B79] border border-slate-200 hover:border-[#003B79] px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
            Kontakt aufnehmen
          </a>
        </div>
      </div>
    </div>
  )
}
