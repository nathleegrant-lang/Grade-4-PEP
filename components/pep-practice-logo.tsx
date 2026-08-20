import { p0 } from "@/components/logo-assets/primary-0"
import { p1 } from "@/components/logo-assets/primary-1"
import { p2 } from "@/components/logo-assets/primary-2"
import { p3 } from "@/components/logo-assets/primary-3"
import { p4 } from "@/components/logo-assets/primary-4"
import { p5 } from "@/components/logo-assets/primary-5"

type PepPracticeLogoProps = { variant?: "primary" | "endorsed" | "compact"; className?: string }
const APPROVED_PRIMARY = `data:image/webp;base64,${p0}${p1}${p2}${p3}${p4}${p5}`

export function PepPracticeLogo({ variant = "primary", className = "" }: PepPracticeLogoProps) {
  const compact = variant === "compact"
  return <div className={className}>
    <div className={`overflow-hidden rounded-lg bg-white ${compact ? "p-1" : "p-1.5 sm:p-2"}`}>
      <img src={APPROVED_PRIMARY} alt="PEP PRACTICE Grade 4 — Practice, Review, Confidence" className={`block h-auto object-contain ${compact ? "w-[220px] max-w-[58vw]" : "w-[390px] max-w-[62vw]"}`} />
    </div>
    {variant === "endorsed" && <div className="mx-auto mt-2 flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-300 sm:text-xs"><span className="h-px w-7 bg-slate-500" /><span>by Shazonique&apos;s Inspiration</span><span className="h-px w-7 bg-slate-500" /></div>}
  </div>
}
