import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Search, MapPin, Phone, Mail, Globe, CheckCircle2, ArrowRight, Building2, User } from "lucide-react"
import { Button } from "../components/ui/button"

// Mock Data
type Partner = {
  id: number;
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  plzPrefixes: string[];
};

const MOCK_PARTNERS = [
  {
    id: 1,
    name: "Rheinbahn AG",
    address: "Lierenfelder Str. 42, 40231 Düsseldorf",
    contactPerson: "Max Mustermann",
    phone: "0211 582-0",
    email: "jobticket@rheinbahn.de",
    website: "www.rheinbahn.de",
    plzPrefixes: ["40", "41", "42"]
  },
  {
    id: 2,
    name: "Kölner Verkehrs-Betriebe AG",
    address: "Scheidtweilerstraße 38, 50933 Köln",
    contactPerson: "Julia Schmidt",
    phone: "0221 547-0",
    email: "grosskunden@kvb.koeln",
    website: "www.kvb.koeln",
    plzPrefixes: ["50", "51"]
  },
  {
    id: 3,
    name: "Stadtwerke Bonn Verkehrs-GmbH",
    address: "Sandkaule 2, 53111 Bonn",
    contactPerson: "Team Firmenkunden",
    phone: "0228 711-1",
    email: "firmenkunden@swb-busundbahn.de",
    website: "www.swb-busundbahn.de",
    plzPrefixes: ["53"]
  },
  {
    id: 4,
    name: "Jenaer Nahverkehr GmbH",
    address: "Keßlerstraße 27, 07745 Jena",
    contactPerson: "Kundenservice Jobticket",
    phone: "03641 414-0",
    email: "jobticket@nahverkehr-jena.de",
    website: "www.stadtwerke-jena.de",
    plzPrefixes: ["07"]
  }
] satisfies Partner[];

const SAMPLE_PARTNERS_99085: Partner[] = [
  {
    id: 101,
    name: "SWE EVAG Erfurt",
    address: "Magdeburger Allee 34, 99086 Erfurt",
    contactPerson: "Team Firmenkunden",
    phone: "0361 564-0",
    email: "service@evag-erfurt.de",
    website: "www.evag-erfurt.de",
    plzPrefixes: ["99"],
  },
  {
    id: 102,
    name: "DB Regio AG Region Südost",
    address: "Kundendialog Jobticket, 04109 Leipzig",
    contactPerson: "DB Geschäftskundenservice",
    phone: "030 2970",
    email: "geschaeftskunden@deutschebahn.com",
    website: "www.bahn.de",
    plzPrefixes: ["99"],
  },
  {
    id: 103,
    name: "Verkehrsverbund Mittelthüringen (VMT)",
    address: "Häßlerstraße 8, 99096 Erfurt",
    contactPerson: "VMT Beratungsteam",
    phone: "0361 19449",
    email: "service@vmt-thueringen.de",
    website: "www.vmt-thueringen.de",
    plzPrefixes: ["99"],
  },
];

export default function Lookup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPlz = searchParams.get("plz") || "";
  
  const [plz, setPlz] = useState(initialPlz);
  const [hasSearched, setHasSearched] = useState(!!initialPlz);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<number[]>([]);

  const getPartners = (): Partner[] => {
    if (!plz || plz.length < 2) return [];
    if (plz === "99085") return SAMPLE_PARTNERS_99085;
    const prefix = plz.substring(0, 2);
    return MOCK_PARTNERS.filter(p => p.plzPrefixes.includes(prefix));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (plz.length >= 2) {
      setHasSearched(true);
      // Update URL without reload
      navigate(`/lookup?plz=${plz}`, { replace: true });
    }
  };

  const handleSelect = (id: number) => {
    setSelectedPartnerIds((prev) =>
      prev.includes(id) ? prev.filter((partnerId) => partnerId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (selectedPartnerIds.length > 0) {
      navigate(`/success?partners=${selectedPartnerIds.join(",")}`);
    }
  };

  const partners = getPartners();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Form Header */}
      <div className="bg-[#003B79] pt-16 pb-32 text-center px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Finden Sie Ihren <span className="text-[#A3C410]">Verbundpartner</span>
          </h1>
          <p className="text-xl text-white/80">
            Wir leiten Ihre Anfrage direkt an den zuständigen Ansprechpartner weiter.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-3xl -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex bg-slate-50 border-b border-slate-100">
            <div className="flex-1 py-4 text-center text-slate-400 font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Ihre Daten
            </div>
            <div className="flex-1 py-4 text-center border-b-2 border-[#003B79] font-bold text-[#003B79] flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#003B79] text-white text-xs flex items-center justify-center">2</span>
              Verbundpartner
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="mb-10">
              <label className="block text-sm font-medium text-slate-700 mb-2">PLZ EINGEBEN</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={plz}
                    onChange={(e) => setPlz(e.target.value)}
                    placeholder="Postleitzahl Ihres Standorts"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-[#003B79] focus:ring-2 focus:ring-[#003B79]/20 outline-none transition-all text-lg font-medium"
                    maxLength={5}
                  />
                </div>
                <Button type="submit" size="lg" className="bg-[#003B79] text-white hover:bg-[#003B79]/90 px-8 h-auto rounded-xl">
                  Suchen
                </Button>
              </div>
            </form>

            {/* Results */}
            {hasSearched && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {partners.length > 0 
                    ? `${plz === "99085" ? "3 Beispiel-Partner" : "Zuständige Partner"} für ${plz}` 
                    : `Kein direkter Partner für ${plz} gefunden`}
                </h3>

                {partners.length > 0 ? (
                  <div className="space-y-4">
                    {partners.map(partner => (
                      <div 
                        key={partner.id}
                        onClick={() => handleSelect(partner.id)}
                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPartnerIds.includes(partner.id)
                            ? 'border-[#A3C410] bg-[#A3C410]/5' 
                            : 'border-slate-200 hover:border-[#003B79]/30 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="w-16 h-16 bg-[#003B79]/5 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-8 h-8 text-[#003B79]" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-[#003B79] mb-1">{partner.name}</h4>
                            <p className="text-slate-600 text-sm mb-4">{partner.address}</p>
                            
                            <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-700">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                {partner.contactPerson}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {partner.phone}
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <a href={`mailto:${partner.email}`} className="text-[#003B79] hover:underline" onClick={e => e.stopPropagation()}>{partner.email}</a>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-slate-400" />
                                <a href={`https://${partner.website}`} target="_blank" rel="noreferrer" className="text-[#003B79] hover:underline" onClick={e => e.stopPropagation()}>{partner.website}</a>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-center sm:self-center mt-4 sm:mt-0">
                            <input
                              type="checkbox"
                              checked={selectedPartnerIds.includes(partner.id)}
                              onChange={() => handleSelect(partner.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-5 w-5 accent-[#003B79] cursor-pointer"
                              aria-label={`${partner.name} auswählen`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-slate-700 mb-2">Wir helfen Ihnen gerne weiter</h4>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                      Für diese Postleitzahl haben wir aktuell keinen direkten Verbundpartner hinterlegt. 
                      Bitte reichen Sie Ihre Anfrage trotzdem ein, unser zentrales Team wird sich umgehend bei Ihnen melden.
                    </p>
                    <Button onClick={() => handleSelect(-1)} variant="outline" className={`border-2 ${selectedPartnerIds.includes(-1) ? 'border-[#003B79] bg-[#003B79]/5' : ''}`}>
                      Anfrage zentral einreichen
                    </Button>
                  </div>
                )}

                <div className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center">
                  <Button variant="ghost" onClick={() => navigate('/apply')} className="text-slate-500">
                    Zurück
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={selectedPartnerIds.length === 0}
                    size="lg" 
                    className="bg-[#A3C410] text-[#003B79] hover:bg-[#A3C410]/90 text-lg px-8 h-14"
                  >
                    Anfrage an ausgewählte Partner senden
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
            
            {!hasSearched && (
              <div className="text-center p-12 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
                Bitte geben Sie eine Postleitzahl ein, um Verbundpartner in Ihrer Nähe zu finden.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
