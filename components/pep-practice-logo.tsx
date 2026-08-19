type PepPracticeLogoProps = {
  variant?: "primary" | "endorsed" | "compact"
  grade?: 4 | 5 | 6
  className?: string
}

const gradeStyles = {
  4: { bg: "bg-pink-500", ring: "ring-pink-500", label: "4" },
  5: { bg: "bg-blue-600", ring: "ring-blue-600", label: "5" },
  6: { bg: "bg-green-600", ring: "ring-green-600", label: "6" },
} as const

function MasterSymbol({ compact = false }: { compact?: boolean }) {
  return <svg viewBox="0 0 116 96" className={compact ? "h-[44px] w-[53px]" : "h-[58px] w-[70px] sm:h-[66px] sm:w-[80px]"} aria-hidden="true">
    <path d="M15 62A44 44 0 0 1 48 12" fill="none" stroke="#1557e8" strokeWidth="4" strokeLinecap="round" />
    <path d="M84 21a43 43 0 0 1 13 42" fill="none" stroke="#169b45" strokeWidth="4" strokeLinecap="round" />
    <path d="M58 4l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1 4-9Z" fill="#fbb400" />
    <path d="M90 22l2 5 6 .5-4.5 4 1.5 6-5-3-5 3 1.5-6-4.5-4 6-.5 2-5Z" fill="#169b45" />
    <rect x="27" y="27" width="54" height="39" rx="5" fill="#081a55" /><rect x="32" y="32" width="44" height="27" rx="2" fill="#fff" />
    <rect x="35" y="36" width="11" height="11" rx="2" fill="#ef1870" /><path d="m38 41 3 3 5-6" fill="none" stroke="#fff" strokeWidth="2" />
    <path d="M50 38h15M50 44h12M36 52h16" stroke="#78b4ff" strokeWidth="3" strokeLinecap="round" />
    <rect x="57" y="49" width="5" height="8" rx="1" fill="#16a34a" /><rect x="65" y="44" width="5" height="13" rx="1" fill="#16a34a" /><rect x="73" y="38" width="5" height="19" rx="1" fill="#16a34a" />
    <path d="M20 69c15-8 29-7 39 1v18c-12-8-25-9-39-2V69Zm39 1c11-8 24-9 39-1v17c-14-7-27-6-39 2V70Z" fill="#fff" stroke="#0a2b78" strokeWidth="3" />
    <path d="M20 75c15-6 28-5 39 2M59 77c11-7 24-8 39-2" fill="none" stroke="#ef1870" strokeWidth="3" /><path d="M22 82c14-5 26-4 37 2M59 84c11-6 23-7 37-2" fill="none" stroke="#1557e8" strokeWidth="3" />
    <circle cx="59" cy="88" r="4" fill="#081a55" /><path d="m78 58 16 8-7 4 5 10-5 2-5-10-6 5 2-19Z" fill="#fbb400" stroke="#fff" strokeWidth="2" /><path d="M36 92c14 7 31 7 45 0" fill="none" stroke="#169b45" strokeWidth="4" strokeLinecap="round" />
  </svg>
}

function GradeBadge({ grade, compact = false }: { grade: 4 | 5 | 6; compact?: boolean }) {
  const style = gradeStyles[grade]
  return <div className={`relative flex shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-2 ring-amber-400 ${style.bg} ${compact ? "h-10 w-10" : "h-[50px] w-[50px] sm:h-[56px] sm:w-[56px]"}`}>
    <span className={`absolute rounded-full border-2 border-blue-600 border-l-transparent border-b-green-600 ${compact ? "-inset-1" : "-inset-[5px]"}`} />
    <span className={`text-center font-black leading-[.85] ${compact ? "text-[7px]" : "text-[8px] sm:text-[9px]"}`}>GRADE<br /><span className={compact ? "text-[21px]" : "text-[26px] sm:text-[29px]"}>{style.label}</span></span>
  </div>
}

export function PepPracticeLogo({ variant = "primary", grade = 4, className = "" }: PepPracticeLogoProps) {
  const compact = variant === "compact"
  return <div className={className}>
    <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2 sm:gap-3"}`}>
      <MasterSymbol compact={compact} />
      <div className="min-w-0">
        <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2 sm:gap-3"}`}>
          <div className="leading-none"><div className={`font-black tracking-[.06em] text-white ${compact ? "text-[20px]" : "text-[28px] sm:text-[36px]"}`}>PEP</div><div className={`mt-1 font-black tracking-[.12em] text-blue-400 ${compact ? "text-[10px]" : "text-[14px] sm:text-[18px]"}`}>PRACTICE</div></div>
          <span className={`w-px bg-white/45 ${compact ? "h-9" : "h-11 sm:h-13"}`} />
          <GradeBadge grade={grade} compact={compact} />
        </div>
        {!compact && <p className="mt-1 text-[8px] font-black uppercase tracking-[.08em] sm:text-[9px]"><span className="text-blue-300">Practice</span><span className="text-white"> • </span><span className="text-green-400">Review</span><span className="text-white"> • </span><span className="text-pink-400">Confidence</span></p>}
      </div>
    </div>
    {variant === "endorsed" && <div className="mt-2 flex items-center gap-2 pl-2 text-[10px] font-semibold text-slate-300 sm:text-xs"><span className="h-px w-7 bg-slate-500" /><span>by Shazonique&apos;s Inspiration</span><span className="h-px w-7 bg-slate-500" /></div>}
  </div>
}
