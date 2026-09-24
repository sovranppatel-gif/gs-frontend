import { CheckCircle2, Calendar, Clock, User, Hash } from "lucide-react";

export default function WorkshopSuccess({ registration, isDuplicate, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden my-auto">
        <div className="bg-gradient-to-br from-[#00A896] to-[#008C95] px-6 py-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold">
            {isDuplicate ? "Already Registered!" : "Registration Successful!"}
          </h2>
          <p className="mt-2 text-sm text-white/90">
            {isDuplicate
              ? "You are already registered for this workshop."
              : "Thank you for registering for the Skills Enhance Workshop."}
          </p>
        </div>

        <div className="px-6 py-6 space-y-4">
          {registration?.fullName ? (
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
              <User size={18} className="text-[#00A896] shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Name
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {registration.fullName}
                </p>
              </div>
            </div>
          ) : null}

          {registration?.registrationId ? (
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
              <Hash size={18} className="text-[#FF5E14] shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Registration ID
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {registration.registrationId}
                </p>
              </div>
            </div>
          ) : null}

          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Skills Enhance Workshop
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Calendar size={16} className="text-[#00A896] shrink-0" />
              <span>1 October – 10 October 2026</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Clock size={16} className="text-[#FF5E14] shrink-0" />
              <span>1:00 PM – 3:00 PM</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center leading-relaxed">
            We will contact you with further details before the workshop begins. Keep an eye on your email and phone.
          </p>

          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#06151C] hover:bg-[#0a1f2e] text-white font-bold py-3 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
