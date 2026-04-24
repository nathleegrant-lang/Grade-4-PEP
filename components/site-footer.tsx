import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        <Image src="/images/logo.png" alt="Grade 4 PEP Logo" width={60} height={60} className="h-12 w-auto mx-auto mb-4" />
        <p className="text-sky-light">Grade 4 PEP Practice - Supporting Jamaica&apos;s Primary Exit Profile Preparation</p>
        <p className="text-sky-light/70 text-sm mt-2">Aligned with the National Standards Curriculum (NSC)</p>
        <p className="text-sky-light/70 text-sm mt-2">A product of Shazonique&apos;s Inspiration</p>
        <p className="text-sky-light/70 text-sm mt-2">WhatsApp: 876-505-5212</p>
        <p className="text-sky-light/70 text-xs mt-2">Grade 4 access is sold separately from Grade 5 and other LearnJA offerings.</p>
      </div>
    </footer>
  )
}
