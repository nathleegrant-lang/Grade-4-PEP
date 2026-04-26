{hasActiveSubscription ? (
  <div className="space-y-4">
    <div className="rounded-xl border-2 border-emerald-600 bg-emerald-100 p-5 shadow-md">
      <p className="text-lg font-extrabold text-emerald-900 mb-2">
        ✅ Access Already Active
      </p>
      <p className="text-sm text-emerald-900">
        Your Grade 4 access is already active.
        {activeSubscription?.expires_at && (
          <>
            {" "}It is active until{" "}
            <span className="font-bold">
              {new Date(activeSubscription.expires_at).toLocaleDateString()}
            </span>.
          </>
        )}
      </p>
    </div>

    <Link href="/dashboard">
      <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
        Go to Dashboard
      </Button>
    </Link>
  </div>
) : (
  <>
    {/* payment steps + form */}
  </>
)}
