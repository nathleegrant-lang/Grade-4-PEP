import Link from "next/link"
import { WHATSAPP_DISPLAY } from "@/lib/site-config"

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div><h3 className="font-semibold text-lg">Grade 4 PEP</h3><p className="text-sky-light/80 text-sm mt-2">Interactive Grade 4 practice, payment verification, and parent-managed student access.</p><p className="text-sky-light/70 text-sm mt-2">WhatsApp: {WHATSAPP_DISPLAY}</p></div>
          <div><h4 className="font-semibold mb-3">Quick Links</h4><div className="flex flex-col gap-2 text-sm text-sky-light/80"><Link href="/pricing" className="hover:text-white">Pricing</Link><Link href="/dashboard" className="hover:text-white">Dashboard</Link><Link href="/about" className="hover:text-white">About</Link></div></div>
          <div><h4 className="font-semibold mb-3">Note</h4><p className="text-sm text-sky-light/80">Each grade programme is sold separately. Grade 4 access does not include Grade 5.</p></div>
        </div>
      </div>
    </footer>
  )
}
