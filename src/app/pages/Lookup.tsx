import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Search, MapPin, Phone, Mail, Globe, ArrowRight, Building2, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import mapHeaderImg from "../../imports/map.png"
import { 
  findPartnersByPlz, 
  isSelectable, 
  type Partner, 
  type PartnerSlug,
  PARTNERS 
} from "../data/partners"

export default function Lookup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPlz = searchParams.get("plz") || "";
  const errorFromQuery = searchParams.get("error");
  const initialSelectedPartners = (searchParams.get("partners") || "")
    .split(",")
    .filter((slug): slug is PartnerSlug => slug !== "" && slug in PARTNERS);
  
  const [plz, setPlz] = useState(initialPlz);
  const [hasSearched, setHasSearched] = useState(!!initialPlz && initialPlz.length === 5);
  const [selectedPartnerSlugs, setSelectedPartnerSlugs] = useState<PartnerSlug[]>(initialSelectedPartners);
  const [selectionError, setSelectionError] = useState(
    errorFromQuery === "select_partner" ? "Bitte einen Verbundpartner auswählen." : ""
  );

  const getPartners = (): Partner[] => {
    if (!plz || plz.length !== 5) return [];
    return findPartnersByPlz(plz);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (plz.length === 5) {
      setHasSearched(true);
      setSelectedPartnerSlugs([]);
      navigate(`/lookup?plz=${plz}`, { replace: true });
    }
  };

  const handleSelect = (partner: Partner) => {
    if (!isSelectable(partner)) return;
    
    setSelectionError("");
    setSelectedPartnerSlugs((prev) =>
      prev.includes(partner.slug) 
        ? prev.filter((s) => s !== partner.slug) 
        : [...prev, partner.slug]
    );
  };

  const handleSubmit = () => {
    const selectablePartners = selectedPartnerSlugs.filter(
      (slug) => isSelectable(PARTNERS[slug])
    );
    if (selectablePartners.length === 0) {
      setSelectionError("Bitte einen Verbundpartner auswählen.");
      return;
    }
    setSelectionError("");
    navigate(`/apply?partners=${selectablePartners.join(",")}&plz=${plz}`);
  };

  const handleCentralSubmit = () => {
    setSelectionError("");
    navigate(`/apply?partners=vmt&plz=${plz}`);
  };

  const handleResetSearch = () => {
    setPlz("");
    setHasSearched(false);
    setSelectedPartnerSlugs([]);
    setSelectionError("");
    navigate("/lookup", { replace: true });
  };

  const partners = getPartners();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Form Header */}
      <div className="bg-[#003B79] pt-16 pb-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={mapHeaderImg}
            alt="Verbundpartner Karte"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003B79]/90 to-[#003B79]/60" />
        </div>
        <div className="container mx-auto max-w-3xl relative z-10">
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
            <div className="flex-1 py-4 text-center border-b-2 border-[#003B79] font-bold text-[#003B79] flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#003B79] text-white text-xs flex items-center justify-center">1</span>
              Verbundpartner
            </div>
            <div className="flex-1 py-4 text-center text-slate-400 font-medium flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center">2</span>
              Ihre Daten
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
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                      setPlz(value);
                    }}
                    placeholder="5-stellige Postleitzahl"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-[#003B79] focus:ring-2 focus:ring-[#003B79]/20 outline-none transition-all text-lg font-medium"
                    maxLength={5}
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-[#003B79] text-white hover:bg-[#003B79]/90 px-8 h-auto rounded-xl disabled:opacity-50"
                  disabled={plz.length !== 5}
                >
                  Suchen
                </Button>
              </div>
            </form>

            {/* Results */}
            {hasSearched && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  {partners.length > 0 
                    ? `${partners.length === 1 ? "Zuständiger Partner" : "Zuständige Partner"} für ${plz}` 
                    : `Kein direkter Partner für ${plz} gefunden`}
                </h3>

                {partners.length > 0 ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                    {partners.map(partner => {
                      const selectable = isSelectable(partner);
                      const isSelected = selectedPartnerSlugs.includes(partner.slug);
                      
                      return (
                        <div 
                          key={partner.slug}
                          onClick={() => handleSelect(partner)}
                          className={`relative p-6 rounded-xl border-2 transition-all ${
                            selectable ? "cursor-pointer" : "cursor-default"
                          } ${
                            isSelected
                              ? 'border-[#A3C410] bg-[#A3C410]/5' 
                              : selectable
                                ? 'border-slate-200 hover:border-[#003B79]/30 bg-white'
                                : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            {/* Logo / Icon */}
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              selectable ? "bg-[#003B79]/5" : "bg-slate-100"
                            }`}>
                              {partner.logo ? (
                                <img 
                                  src={partner.logo} 
                                  alt={partner.name} 
                                  className="w-12 h-12 object-contain"
                                />
                              ) : (
                                <Building2 className={`w-8 h-8 ${selectable ? "text-[#003B79]" : "text-slate-400"}`} />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className={`text-lg font-bold mb-1 ${selectable ? "text-[#003B79]" : "text-slate-500"}`}>
                                {partner.name}
                              </h4>
                              
                              {partner.address && (
                                <p className="text-slate-600 text-sm mb-4">{partner.address}</p>
                              )}
                              
                              {/* Not selectable notice */}
                              {!selectable && (
                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-sm mb-4">
                                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                  <span>Kontakt über VMT — E-Mail-Adresse folgt</span>
                                </div>
                              )}
                              
                              <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-700">
                                {partner.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400" />
                                    {partner.phone}
                                  </div>
                                )}
                                {partner.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <a 
                                      href={`mailto:${partner.email}`} 
                                      className="text-[#003B79] hover:underline" 
                                      onClick={e => e.stopPropagation()}
                                    >
                                      {partner.email}
                                    </a>
                                  </div>
                                )}
                                {partner.website && (
                                  <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-slate-400" />
                                    <a 
                                      href={`https://${partner.website}`} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-[#003B79] hover:underline" 
                                      onClick={e => e.stopPropagation()}
                                    >
                                      {partner.website}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Checkbox */}
                            <div className="flex items-center justify-center sm:self-center mt-4 sm:mt-0">
                              {selectable ? (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelect(partner)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-5 w-5 accent-[#003B79] cursor-pointer"
                                  aria-label={`${partner.name} auswählen`}
                                />
                              ) : (
                                <div className="h-5 w-5 border-2 border-slate-300 rounded bg-slate-100" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-slate-700 mb-2">Wir helfen Ihnen gerne weiter</h4>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">
                      Für diese Postleitzahl haben wir aktuell keinen direkten Verbundpartner hinterlegt. 
                      Bitte reichen Sie Ihre Anfrage trotzdem ein, unser zentrales Team wird sich umgehend bei Ihnen melden.
                    </p>
                    <Button 
                      onClick={handleCentralSubmit} 
                      className="bg-[#003B79] text-white hover:bg-[#003B79]/90"
                    >
                      Anfrage zentral einreichen
                    </Button>
                  </div>
                )}

                {partners.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <Button variant="ghost" onClick={handleResetSearch} className="text-slate-500">
                      Suche zurücksetzen
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      size="lg" 
                      className="bg-[#A3C410] text-[#003B79] hover:bg-[#A3C410]/90 text-lg px-8 h-14 w-full sm:w-auto"
                    >
                      Weiter zu Ihren Daten
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}
                {selectionError && (
                  <p className="mt-3 text-sm text-red-600 text-right">{selectionError}</p>
                )}
              </div>
            )}
            
            {!hasSearched && (
              <div className="text-center p-12 bg-slate-50 rounded-xl border border-slate-100 text-slate-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
                Bitte geben Sie eine 5-stellige Postleitzahl ein, um Verbundpartner in Ihrer Nähe zu finden.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
