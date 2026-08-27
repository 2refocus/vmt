import { Link } from "react-router"
import { Building2, UserCircle2, ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import vmtLogoNoSubline from "../../imports/vmt-logo-01_nosubline.svg"
import employerBg from "../../imports/AdobeStock_232967360_Preview.jpg"
import employeeBg from "../../imports/AdobeStock_497280944_Preview.jpeg"

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <div className="absolute top-4 inset-x-4 z-20 lg:hidden bg-white/95 rounded-lg px-4 py-2 shadow-sm flex flex-row items-center justify-center gap-3">
        <img src={vmtLogoNoSubline} alt="VMT Logo" className="h-8 w-auto shrink-0" />
        <div className="font-bold text-[#003B79] leading-tight text-xs sm:text-sm tracking-tight text-center">
          DAS DEUTSCHLANDTICKET <span className="text-[#A3C410]">JOB</span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Company Section */}
      <div className="relative flex-1 flex flex-col justify-start lg:justify-center items-center pt-24 lg:pt-16 p-8 lg:p-16 bg-[#003B79] text-white overflow-hidden group">
        {/* Header background image with blue gradient overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={employerBg} alt="" className="h-full w-full object-cover object-center opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#003B79]/80 via-[#003B79]/60 to-[#002a58]/80" />
        </div>
        {/* Background Pattern/Graphic */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#A3C410] rounded-full mix-blend-overlay filter blur-[100px] transform -translate-x-1/2 translate-y-1/4 group-hover:scale-110 transition-transform duration-1000" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-lg w-full text-right"
        >
          <div className="mb-8">
            <p className="text-5xl lg:text-6xl font-extrabold tracking-tight text-[#A3C410]">
              Mitarbeiter<br />
              Bonus
            </p>
            <p className="text-3xl lg:text-4xl font-bold leading-tight mt-1">Kommt gut an.</p>
            <p className="mt-3 text-base lg:text-lg text-white/85">
              Bieten Sie Ihrem Team einen attraktiven Mobilitätsbenefit und stärken Sie gleichzeitig Ihre Arbeitgeberattraktivität.
            </p>
          </div>
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 ml-auto">
            <Building2 className="w-10 h-10 text-[#A3C410]" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Für <br />
            <span className="text-[#A3C410]">Unternehmen</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-10 leading-relaxed font-light">
            Steigern Sie Ihre Arbeitgeberattraktivität. <br/>
            Das Ticket, bei dem Sie als Arbeitgeber mitzahlen – 
            einfach integriert und sofort wirksam.
          </p>

          <Link 
            to="/company" 
            className="inline-flex items-center gap-3 bg-[#A3C410] text-[#003B79] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Arbeitgeber-Vorteile entdecken
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Employee Section */}
      <div className="relative flex-1 flex flex-col justify-center items-center p-8 lg:p-16 bg-[#A3C410] text-[#003B79] overflow-hidden group">
        {/* Employee background image with green gradient overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={employeeBg} alt="" className="h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#A3C410]/80 via-[#A3C410]/60 to-[#7ea000]/80" />
        </div>
        {/* Background Pattern/Graphic */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white rounded-full mix-blend-overlay filter blur-[80px] transform translate-x-1/3 translate-y-1/3 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#003B79] rounded-full mix-blend-overlay filter blur-[60px] transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-1000" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 max-w-lg w-full"
        >
          <div className="mb-8">
            <p className="text-5xl lg:text-6xl font-extrabold tracking-tight text-[#003B79]">
              Clever pendeln<br />
              und sparen.
            </p>
            <p className="text-3xl lg:text-4xl font-bold leading-tight mt-1 text-white">Kommt gut an.</p>
            <p className="mt-3 text-base lg:text-lg text-[#003B79]/80">
              Mit dem Zuschuss deines Unternehmens zahlst du weniger für dein Deutschlandticket und bist deutschlandweit mobil.
            </p>
          </div>
          <div className="w-20 h-20 bg-[#003B79]/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-[#003B79]/20">
            <UserCircle2 className="w-10 h-10 text-[#003B79]" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
            Für <br />
            <span className="text-white">Angestellte</span>
          </h1>
          
          <p className="text-xl text-[#003B79]/80 mb-10 leading-relaxed font-medium">
            Dein Chef zahlt. Du sparst. <br/>
            Mindestens 30 % günstiger fahren. 
            Einfach einsteigen, ankommen & profitieren.
          </p>

          <Link 
            to="/employee" 
            className="inline-flex items-center gap-3 bg-[#003B79] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-[#003B79] transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Mitarbeiter-Vorteile ansehen
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>

      {/* Center Logo/Badge (Absolute on Desktop) */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 hidden lg:flex flex-col items-center justify-center pointer-events-none z-20">
        <div className="bg-white px-6 py-4 rounded-3xl shadow-2xl flex flex-row items-center gap-4 border border-slate-100">
          <img src={vmtLogoNoSubline} alt="VMT Logo" className="h-12 w-auto shrink-0" />
          <div className="font-bold text-[#003B79] leading-tight text-lg lg:text-xl tracking-tight">
            DAS DEUTSCHLANDTICKET <span className="text-[#A3C410]">JOB</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
