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
    <div className="grid md:grid-cols-3 gap-4">
      <div className="rounded-xl border border-sky-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <Landmark className="h-5 w-5 text-sky-600" />
          <h4 className="font-semibold text-slate-800">Step 1</h4>
        </div>
        <div className="text-sm text-slate-600 space-y-1">
          <p><span className="font-medium text-slate-700">Bank:</span> {BANK_DETAILS.bank}</p>
          <p><span className="font-medium text-slate-700">Branch:</span> {BANK_DETAILS.branch}</p>
          <p><span className="font-medium text-slate-700">Account name:</span> {BANK_DETAILS.accountName}</p>
          <p><span className="font-medium text-slate-700">Account number:</span> {BANK_DETAILS.accountNumber}</p>
          <p><span className="font-medium text-slate-700">Account type:</span> {BANK_DETAILS.accountType}</p>
        </div>
      </div>

      <div className="rounded-xl border border-sky-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-sky-600" />
          <h4 className="font-semibold text-slate-800">Step 2</h4>
        </div>
        <p className="text-sm text-slate-600">
          Make the payment, then record the transfer reference, deposit slip number,
          or any note that will help you match it later.
        </p>
      </div>

      <div className="rounded-xl border border-sky-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircleMore className="h-5 w-5 text-sky-600" />
          <h4 className="font-semibold text-slate-800">Step 3</h4>
        </div>
        <p className="text-sm text-slate-600 mb-3">
          Submit the reference below and optionally send your receipt by WhatsApp.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-sky-700 hover:underline"
        >
          WhatsApp: {WHATSAPP_DISPLAY}
        </a>
      </div>
    </div>

    <form onSubmit={handleSubmitPayment} className={`space-y-4 ${formLocked ? "opacity-60" : ""}`}>
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      {success && <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">{success}</div>}

      <div className="space-y-2">
        <Label htmlFor="referenceCode">Payment reference or deposit slip number</Label>
        <Input
          id="referenceCode"
          value={referenceCode}
          onChange={(e) => setReferenceCode(e.target.value)}
          placeholder="Enter your transfer or receipt reference"
          disabled={formLocked}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Optional note</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add any helpful note for payment verification"
          rows={4}
          disabled={formLocked}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/pricing" className="flex-1">
          <Button variant="outline" className="w-full">
            Choose Another Plan
          </Button>
        </Link>

        <Button
          type="submit"
          className="flex-1 bg-slate-800 hover:bg-slate-900 text-white"
          disabled={formLocked}
        >
          {checkingStatus
            ? "Checking status..."
            : hasPendingPayment
            ? "Awaiting Verification"
            : submitting
            ? "Submitting..."
            : "Submit Payment Details"}
        </Button>
      </div>
    </form>
  </>
)}
