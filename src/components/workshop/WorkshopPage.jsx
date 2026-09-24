import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Calendar, Clock, MapPin } from "lucide-react";
import WorkshopRegistrationForm from "./WorkshopRegistrationForm";
import { getReferralLinkByCode } from "../../services/workshopService.js";

const HIGHLIGHTS = [
  "Latest Technology & AI Tools",
  "Professional Portfolio Website",
  "LIVE Website Deployment",
  "GitHub Profile & Repository",
  "Professional Resume/CV",
  "LinkedIn Profile Setup",
  "Personality & Communication Development",
  "Self-Introduction & Interview Practice",
  "Project Presentation Skills",
  "Career Guidance & Roadmap",
  "Participation Certificate",
];

/**
 * Referral tracking: the `ref` query param (e.g. /workshop?ref=COLLEGE_A) is
 * read once here and threaded into the form as a prop. It's never rendered
 * on screen and never becomes editable state a student could change — the
 * only way it reaches the backend is the value captured from the URL at
 * mount time.
 */
function getReferralFromUrl() {
  if (typeof window === "undefined") return null;
  const ref = new URLSearchParams(window.location.search).get("ref");
  return ref ? ref.trim() : null;
}

export default function WorkshopPage() {
  const [showForm, setShowForm] = useState(false);
  const [referralCode] = useState(getReferralFromUrl);
  const [workshopDetails, setWorkshopDetails] = useState(null);

  useEffect(() => {
    if (!referralCode) return;
    getReferralLinkByCode(referralCode)
      .then(setWorkshopDetails)
      .catch(() => setWorkshopDetails(null));
  }, [referralCode]);

  const workshopName = workshopDetails?.workshopName || "Skills Enhance Workshop";
  const workshopStartDate = workshopDetails?.workshopStartDate || workshopDetails?.workshopDate || "2026-10-01";
  const workshopEndDate = workshopDetails?.workshopEndDate || workshopDetails?.workshopDate || "2026-10-10";
  const formatWorkshopDate = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return year && month && day ? `${day}-${month}-${year}` : value;
  };
  const workshopDate = `${formatWorkshopDate(workshopStartDate)} – ${formatWorkshopDate(workshopEndDate)}`;
  const workshopTime = workshopDetails?.startTime && workshopDetails?.endTime
    ? `${workshopDetails.startTime} – ${workshopDetails.endTime}`
    : "1:00 PM – 3:00 PM";
  const workshopPlace = workshopDetails?.workshopPlace || "";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#06151C] via-[#0a1f2e] to-[#06151C] px-4 py-12 text-white sm:px-6 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(0, 168, 150, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 94, 20, 0.15) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl space-y-5 text-center sm:space-y-7">
          <span className="inline-block max-w-full break-words rounded-full border border-[#00A896]/50 bg-[#00A896]/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#00E5CC] sm:px-4 sm:text-sm sm:tracking-[0.15em]">
            🚀 {workshopName}
          </span>

          <h1 className="break-words text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            {workshopName.toUpperCase()}
            <span className="mt-2 block bg-gradient-to-r from-[#00E5CC] to-[#FF5E14] bg-clip-text text-2xl leading-tight text-transparent sm:text-4xl md:text-5xl">
              With Latest Technology
            </span>
          </h1>

          <div className="flex flex-col items-center justify-center gap-2 pt-2 text-xs sm:flex-row sm:gap-6 sm:text-lg">
            <div className="flex max-w-full items-center gap-2 text-center text-[#00E5CC]">
              <Calendar size={17} className="shrink-0" />
              <span className="break-words">{workshopDate}</span>
            </div>
            <div className="hidden sm:block text-slate-500">•</div>
            <div className="flex max-w-full items-center gap-2 text-center text-[#FF5E14]">
              <Clock size={17} className="shrink-0" />
              <span className="break-words">{workshopTime}</span>
            </div>
            {workshopPlace ? (
              <>
                <div className="hidden sm:block text-slate-500">•</div>
                <div className="flex max-w-full items-center gap-2 text-center text-[#00E5CC]">
                  <MapPin size={17} className="shrink-0" />
                  <span className="break-words">{workshopPlace}</span>
                </div>
              </>
            ) : null}
          </div>

          <p className="text-slate-400 text-sm sm:text-base">
            Practical + Interactive Sessions
          </p>

          <div className="pt-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5E14] to-[#ff7a2d] px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:from-[#ff7a2d] hover:to-[#ff8c42] hover:shadow-xl active:scale-95 sm:min-h-14 sm:w-auto sm:px-10 sm:py-4 sm:text-base"
            >
              REGISTER NOW
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#06151C] mb-3">
              Workshop Highlights
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#00A896] to-[#FF5E14] mx-auto rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {HIGHLIGHTS.map((highlight) => (
              <div
                key={highlight}
                className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-[#00A896] hover:shadow-md transition"
              >
                <CheckCircle2 size={22} className="text-[#00A896] shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium text-sm leading-snug">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-14 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#00A896]/10 to-[#FF5E14]/10 border border-[#00A896]/30 rounded-2xl p-6 sm:p-12">
            <h3 className="text-xl sm:text-3xl font-bold text-[#06151C] mb-4">
              About This Workshop
            </h3>
            <div className="space-y-3 text-slate-700 leading-relaxed text-sm sm:text-lg">
              <p>
                <strong>Organized by:</strong> GrowSkills Tech Pvt. Ltd.
              </p>
              <p>
                A 10-day practical training program to help students master the latest
                technologies, build real projects, and prepare for their career — with
                live deployment, portfolio building, and interview practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-[#06151C] to-[#0a1f2e]">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h3 className="text-2xl sm:text-4xl font-bold mb-3">
            Ready to Enhance Your Skills?
          </h3>
          <p className="text-sm sm:text-lg text-slate-300 mb-6 sm:mb-8">
            Seats are limited. Register today.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-[#FF5E14] hover:bg-[#ff7a2d] text-white font-bold py-3 px-8 rounded-xl transition transform hover:scale-105 text-sm sm:text-base"
          >
            REGISTER NOW
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {showForm && (
        <WorkshopRegistrationForm
          referralCode={referralCode}
          referredCollegeName={workshopDetails?.collegeName || ""}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
