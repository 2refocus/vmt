import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Building2, User, Mail, Phone, MapPin, Users, ArrowRight, CheckCircle2 } from "lucide-react"
import { motion } from "motion/react"
import { Button } from "../components/ui/button"
import applyImg from "../../imports/AdobeStock_400849655_Preview.jpeg"

export default function Apply() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPartners = searchParams.get("partners") || "";
  const selectedPartnerIds = selectedPartners
    .split(",")
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);
  const prefilledPlz = searchParams.get("plz") || "";
  const [formData, setFormData] = useState({
    salutation: "",
    firstName: "",
    lastName: "",
    company: "",
    position: "",
    employees: "",
    phone: "",
    email: "",
    street: "",
    plz: prefilledPlz,
    city: "",
    interestPhone: false,
    interestContract: false,
    message: ""
  });

  useEffect(() => {
    // Enforce step order: partner selection first, then form data.
    if (selectedPartnerIds.length === 0) {
      const params = new URLSearchParams();
      if (prefilledPlz) params.set("plz", prefilledPlz);
      params.set("error", "select_partner");
      navigate(`/lookup?${params.toString()}`, { replace: true });
    }
  }, [navigate, selectedPartnerIds.length, prefilledPlz]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/success?partners=${selectedPartnerIds.join(",")}`);
  };

  const goToPartnerSelection = () => {
    const params = new URLSearchParams();
    if (formData.plz) params.set("plz", formData.plz);
    if (selectedPartners) params.set("partners", selectedPartners);
    navigate(`/lookup?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Form Header */}
      <div className="bg-[#003B79] pt-16 pb-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src={applyImg} 
             alt="Deutschlandticket Job Application" 
             className="w-full h-full object-cover object-[50%_55%] opacity-70"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#003B79]/85 to-[#003B79]/55" />
        </div>
        <div className="relative z-10 container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gerne beraten wir Sie zu Ihrer <br/>
            <span className="text-[#A3C410]">individuellen Lösung</span>
          </h1>
          <p className="text-xl text-white/80">
            mit dem Deutschlandticket Job für Ihre Mitarbeiter*innen.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 max-w-3xl -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex bg-slate-50 border-b border-slate-100">
            <button
              type="button"
              onClick={goToPartnerSelection}
              className="flex-1 py-4 text-center text-slate-400 hover:text-[#003B79] font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Verbundpartner
            </button>
            <div className="flex-1 py-4 text-center border-b-2 border-[#003B79] font-bold text-[#003B79] flex items-center justify-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#003B79] text-white text-xs flex items-center justify-center">2</span>
              Ihre Daten
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="space-y-8">
              
              {/* Kontaktperson */}
              <section>
                <h3 className="text-lg font-bold text-[#003B79] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Ansprechpartner:in
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Anrede *</label>
                    <select 
                      name="salutation" 
                      required
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all bg-white"
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="Frau">Frau</option>
                      <option value="Herr">Herr</option>
                      <option value="Divers">Divers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vorname *</label>
                    <input type="text" name="firstName" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nachname *</label>
                    <input type="text" name="lastName" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                </div>
              </section>

              {/* Unternehmen */}
              <section>
                <h3 className="text-lg font-bold text-[#003B79] mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Unternehmen
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unternehmen *</label>
                    <input type="text" name="company" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Position *</label>
                    <input type="text" name="position" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unternehmensgröße *</label>
                    <select name="employees" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all bg-white">
                      <option value="">Bitte wählen...</option>
                      <option value="1-9">1-9 Mitarbeiter</option>
                      <option value="10-49">10-49 Mitarbeiter</option>
                      <option value="50-249">50-249 Mitarbeiter</option>
                      <option value="250+">250+ Mitarbeiter</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Kontakt */}
              <section>
                <h3 className="text-lg font-bold text-[#003B79] mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Kontaktdaten
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefonnummer *</label>
                    <input type="tel" name="phone" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail *</label>
                    <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                </div>
              </section>

              {/* Adresse */}
              <section>
                <h3 className="text-lg font-bold text-[#003B79] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Standort
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Straße / Nr. *</label>
                    <input type="text" name="street" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">PLZ *</label>
                    <input type="text" name="plz" required value={formData.plz} onChange={handleChange} maxLength={5} pattern="[0-9]{5}" title="Bitte geben Sie eine gültige 5-stellige PLZ ein" placeholder="z.B. 50667" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ort *</label>
                    <input type="text" name="city" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all" />
                  </div>
                </div>
              </section>

              {/* Preferences */}
              <section className="pt-4 border-t border-slate-100">
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input type="checkbox" name="interestPhone" onChange={handleChange} className="peer w-5 h-5 appearance-none border-2 border-slate-300 rounded checked:bg-[#003B79] checked:border-[#003B79] transition-colors cursor-pointer" />
                      <CheckCircle2 className="w-4 h-4 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Ich wünsche eine telefonische Beratung</span>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input type="checkbox" name="interestContract" onChange={handleChange} className="peer w-5 h-5 appearance-none border-2 border-slate-300 rounded checked:bg-[#003B79] checked:border-[#003B79] transition-colors cursor-pointer" />
                      <CheckCircle2 className="w-4 h-4 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                    </div>
                    <span className="text-slate-700 group-hover:text-slate-900 transition-colors">Bitte schicken Sie mir die Vertragsunterlagen zu</span>
                  </label>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ihre Nachricht an uns (optional)</label>
                  <textarea name="message" onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-[#003B79] focus:ring-1 focus:ring-[#003B79] outline-none transition-all resize-none"></textarea>
                </div>
              </section>
            </div>

            <div className="mt-10 flex justify-between items-center">
              <Button type="button" variant="ghost" onClick={goToPartnerSelection} className="text-slate-500">
                Zurück zur Partnerauswahl
              </Button>
              <Button type="submit" size="lg" className="bg-[#003B79] text-white hover:bg-[#003B79]/90 text-lg h-14 px-8 w-full sm:w-auto">
                Anfrage verbindlich absenden
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
