import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-800">
      <div className="container mx-auto grid gap-8 px-4 py-9 md:grid-cols-3 md:items-start">
        <div>
          <img
            src="/images/pep-practice-grade4-primary-footer.png"
            alt="PEP PRACTICE Grade 4 — Practice Review Confidence — by Shazonique's Inspiration"
            width="712"
            height="243"
            className="h-auto w-full max-w-[340px] object-contain object-left"
          />
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
            Different grade. Different developmental stage. Same PEP PRACTICE.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-950">Quick Links</h3>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <Link href="/language-arts" className="font-medium hover:text-blue-700">Start Free Practice</Link>
            <Link href="/pricing" className="font-medium hover:text-blue-700">View Pricing</Link>
            <Link href="/login" className="font-medium hover:text-blue-700">Sign In</Link>
            <Link href="/register" className="font-medium hover:text-blue-700">Create Account</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-950">Grade 4 Learning</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Language Arts, Mathematics, Performance Tasks and mock-style practice in one focused Grade 4 experience.
          </p>
          <Link href="/about" className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:text-blue-900">
            About PEP PRACTICE
          </Link>
        </div>
      </div>

      <div className="border-t border-blue-800 bg-blue-900 px-4 py-5 text-center text-xs font-medium tracking-[0.01em] text-white">
        <span>© {new Date().getFullYear()}</span>
        <span className="mx-1.5">Shazonique&apos;s Inspiration.</span>
        <span>PEP PRACTICE — Grade 4.</span>
      </div>
    </footer>
  )
}
