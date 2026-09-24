import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import logo from "../../assets/logo.png";
import landingbg from "../../assets/images/landing-bg.jpg";
import {
  CheckCircle2,
  Phone,
  Mail,
  Target,
  Zap,
  Lightbulb,
  Users,
  Globe,
  TrendingUp,
  Code,
  Smartphone,
  Palette,
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Menu,
  X,
  Plus,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Rocket,
  Layers,
  GraduationCap,
  Cpu,
} from "lucide-react";
import EnquiryForm from "../enquiry/EnquiryForm.jsx";
import { defaultLandingSettings, getLandingSettings } from "../../utils/siteSettings.js";
import { API_URL } from "../../utils/api.js";
import { useAboutSection } from "../../hooks/useAboutSection.js";
import { useExpertiseSection } from "../../hooks/useExpertiseSection.js";
import { useProcessSection } from "../../hooks/useProcessSection.js";
import { useServicesSection } from "../../hooks/useServicesSection.js";
import { useCaseStudyStrip } from "../../hooks/useCaseStudyStrip.js";
import { useFaqSection } from "../../hooks/useFaqSection.js";
import { useHeroLeftSection } from "../../hooks/useHeroLeftSection.js";
import SeoHead from "../SeoHead.jsx";
import { pageSeo } from "../../utils/seoConfig.js";

/** ["Building Your Creativity-", "Connect your community"] — mobile/tablet par do lines ke liye */
function splitTaglineAtHyphen(tagline) {
  const t = tagline || "";
  const i = t.indexOf("-");
  if (i === -1) return null;
  const rest = t.slice(i + 1).trimStart();
  return [t.slice(0, i + 1), rest].filter(Boolean);
}

/** In-page scroll without pushing browser history (fixes back-button spam) */
function scrollToSection(hashOrId) {
  const id = String(hashOrId || "").replace(/^#/, "");
  if (!id || id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleSectionNav(e, hashOrId) {
  e.preventDefault();
  scrollToSection(hashOrId);
}

function buildWhatsAppLink(phone, text) {
  const digits = String(phone || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${query}`;
}

/* ================= SHARED VISUAL PRIMITIVES ================= */

/** Subtle animated grid + glow, used as a section-level backdrop */
function GridBackdrop({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]" />
    </div>
  );
}

/** Reveal-on-scroll wrapper (lightweight, framer-motion already installed; respects prefers-reduced-motion via MotionConfig) */
function Reveal({ children, className = "", delay = 0, y = 18 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return undefined;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

/** Animated count-up for numeric labels like "150+", "45%", "100%" */
function CountUpValue({ value, active, className = "" }) {
  const [display, setDisplay] = useState(active ? value : "0");
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const str = String(value || "");
    const match = str.match(/[\d.]+/);
    if (!match) {
      setDisplay(str);
      return undefined;
    }
    const target = parseFloat(match[0]);
    const prefix = str.slice(0, match.index);
    const suffix = str.slice(match.index + match[0].length);
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current}${suffix}`);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [active, value]);

  return <span className={className}>{display}</span>;
}

// ================= MAIN LAYOUT =================
export default function LandingPage() {
  const [settings, setSettings] = useState(defaultLandingSettings);
  const { aboutData, shouldRender } = useAboutSection();
  const { expertiseData, shouldRender: shouldRenderExpertise } = useExpertiseSection();
  const { processData, shouldRender: shouldRenderProcess } = useProcessSection();
  const { servicesData, shouldRender: shouldRenderServices } = useServicesSection();
  const { caseStudyData, shouldRender: shouldRenderCaseStudy } = useCaseStudyStrip();
  const { faqData, shouldRender: shouldRenderFaq } = useFaqSection();
  const { heroLeftData, shouldRender: shouldRenderHeroLeft } = useHeroLeftSection();

  useEffect(() => {
    let mounted = true;
    getLandingSettings()
      .then((data) => {
        if (mounted) setSettings(data);
      })
      .catch(() => {
        if (mounted) setSettings(defaultLandingSettings);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="min-h-screen overflow-x-hidden bg-[#06151C] text-slate-100 font-sans selection:bg-[#FF5E14]/40 selection:text-white">
        <SeoHead {...pageSeo.home} path="/" />
        {/* Soft gradient halo matching Logo Orange & Teal */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,168,150,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,94,20,0.16),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:120px_120px]" />
        </div>

        <Header settings={settings} />

        {/* HERO */}
        <main className="relative isolate z-10 max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-24 rounded-2xl sm:rounded-3xl">
          <div className="pointer-events-none absolute inset-0 sm:-inset-8 z-0">
            <img src={landingbg} alt="" className="h-full w-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-[#06151C]/70" />
          </div>

          <section className="relative z-10 grid lg:grid-cols-[1.15fr_0.95fr] gap-6 sm:gap-10 lg:gap-14 items-start">
            <HeroLeft content={shouldRenderHeroLeft ? heroLeftData : null} />
            <div className="relative z-10 min-w-0 w-full">
              <HeroVisualFrame>
                <EnquiryForm source="home" />
              </HeroVisualFrame>
            </div>
          </section>

          <div className="relative z-10">
            <HeroMetrics />
          </div>
        </main>

        {/* CONTENT SECTIONS */}
        <AboutSection content={shouldRender ? aboutData : null} />
        <ExpertiseSection content={shouldRenderExpertise ? expertiseData : null} />
        <ServicesSection content={shouldRenderServices ? servicesData : null} />
        <CaseStudyStrip content={shouldRenderCaseStudy ? caseStudyData : null} />
        <WhyUsSection />
        <ProcessSection content={shouldRenderProcess ? processData : null} />
        <TrainingSection settings={settings} />
        <FAQSection content={shouldRenderFaq ? faqData : null} />
        <FinalCtaSection settings={settings} />
        <FooterSection settings={settings} />
      </div>
    </MotionConfig>
  );
}

// ================= HEADER =================
function Header({ settings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#expertise" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
  ];

  const taglineText = settings.tagline || "Innovation. Technology. Growth.";
  const taglineLines = splitTaglineAtHyphen(taglineText);
  const taglineClass = "text-[9px] sm:text-[10px] md:text-[11px] text-[#FF7A00] font-medium tracking-[0.08em] uppercase leading-tight";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#06151C]/95 backdrop-blur-xl border-b border-[#00A896]/30 shadow-[0_10px_40px_rgba(0,0,0,0.45)] py-0"
          : "bg-gradient-to-b from-[#06151C]/90 via-[#06151C]/60 to-[#06151C]/0 border-b border-transparent"
      }`}
    >
      <div
        className={`max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 flex items-center justify-between gap-2 transition-all duration-300 ${
          isScrolled ? "h-14 lg:h-16" : "h-16 lg:h-[4.5rem]"
        }`}
      >
        {/* Logo + Brand */}
        <a
          href="#top"
          onClick={(e) => handleSectionNav(e, "top")}
          className="flex min-w-0 flex-1 md:flex-initial items-center gap-2 sm:gap-3 group"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-[#FF5E14]/40 blur-md opacity-60 group-hover:opacity-90 transition-opacity" />
            <div className="relative bg-gradient-to-br from-[#FFF0E6] via-[#FFB380] to-[#FF5E14] p-1.5 rounded-xl border border-white/60 shadow-[0_10px_35px_rgba(255,94,20,0.45)]">
              <img src={logo} alt="Grow Skills Tech Pvt. Ltd." className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
            </div>
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[10px] sm:text-xs lg:text-base font-bold uppercase tracking-[0.04em] sm:tracking-[0.08em] lg:tracking-[0.14em] leading-tight text-white">
              {settings.companyName || "Grow Skills Tech"}
            </span>
            {taglineLines ? (
              <>
                <span className={`lg:hidden flex min-w-0 flex-col gap-0.5 ${taglineClass}`}>
                  <span className="block">{taglineLines[0]}</span>
                  {taglineLines[1] ? <span className="block">{taglineLines[1]}</span> : null}
                </span>
                <span className={`hidden lg:block min-w-0 truncate ${taglineClass}`}>{taglineText}</span>
              </>
            ) : (
              <span className={`block min-w-0 truncate ${taglineClass}`}>{taglineText}</span>
            )}
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-[10px] lg:text-[11px] font-semibold tracking-[0.08em] lg:tracking-[0.16em] uppercase text-slate-300">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleSectionNav(e, item.href)}
              className="group relative py-1 hover:text-white transition-colors"
            >
              <span>{item.label}</span>
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-gradient-to-r from-[#FF5E14] to-[#00A896] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Community + Auth */}
        <div className="hidden lg:flex items-center gap-2.5">
          <a
            href="#top"
            onClick={(e) => handleSectionNav(e, "top")}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-[#00A896]/50 hover:text-white"
          >
            <Users size={13} className="text-[#00E5CC]" />
            Join Community
          </a>
          <Link
            to="/students"
            className="inline-flex items-center rounded-full border border-[#00A896]/40 bg-[#06151C]/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:border-[#FF5E14] hover:text-[#FF5E14]"
          >
            Sign In
          </Link>
          <Link
            to="/students/signup"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_35px_rgba(255,94,20,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(255,94,20,0.55)]"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen((p) => !p)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-xl border border-[#00A896]/40 bg-[#06151C]/80 text-white hover:border-[#FF5E14] hover:text-[#FF5E14] transition"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={isMobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="md:hidden overflow-hidden border-t border-[#00A896]/25 bg-[#06151C]/97 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-1.5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                handleSectionNav(e, item.href);
                setIsMobileMenuOpen(false);
              }}
              className="block rounded-lg px-3 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-slate-200 hover:bg-white/10 hover:text-[#FF5E14] transition"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#top"
            onClick={(e) => {
              handleSectionNav(e, "top");
              setIsMobileMenuOpen(false);
            }}
            className="block rounded-lg px-3 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-slate-200 hover:bg-white/10 hover:text-[#FF5E14] transition"
          >
            Join Community
          </a>
          <div className="flex flex-col gap-2 pt-2 border-t border-[#00A896]/25 mt-2">
            <Link
              to="/students"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-lg border border-[#00A896]/40 bg-[#06151C]/80 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:border-[#FF5E14] hover:text-[#FF5E14] transition"
            >
              Sign In
            </Link>
            <Link
              to="/students/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5E14] to-[#008C95] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-md"
            >
              Sign Up
            </Link>
            <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#00A896]/35 bg-[#06151C]/80 px-3 py-2.5 text-[11px] tracking-[0.16em] uppercase text-slate-100">
              <Phone size={14} className="text-[#FF5E14]" />
              {settings.contactPhone || "+917470834876"}
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}

// ================= HERO VISUAL: floating stat badges + abstract network around the form =================
function HeroVisualFrame({ children }) {
  return (
    <div className="relative">
      {/* Abstract network/data visual, purely decorative, sits behind the form */}
      <div className="pointer-events-none absolute -inset-6 sm:-inset-10 -z-10 hidden sm:block" aria-hidden="true">
        <svg viewBox="0 0 400 400" className="h-full w-full opacity-70">
          <defs>
            <radialGradient id="nodeGlowOrange" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nodeGlowTeal" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00E5CC" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00E5CC" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g stroke="rgba(148,163,184,0.35)" strokeWidth="1" fill="none">
            <line x1="20" y1="40" x2="90" y2="120" />
            <line x1="90" y1="120" x2="40" y2="220" />
            <line x1="90" y1="120" x2="200" y2="70" />
            <line x1="360" y1="60" x2="300" y2="150" />
            <line x1="300" y1="150" x2="370" y2="260" />
            <line x1="300" y1="150" x2="210" y2="180" />
            <line x1="30" y1="350" x2="120" y2="300" />
            <line x1="380" y1="330" x2="300" y2="280" />
          </g>
          <circle cx="20" cy="40" r="4" fill="url(#nodeGlowOrange)" className="motion-safe:animate-pulse" />
          <circle cx="90" cy="120" r="5" fill="#FF7A00" className="motion-safe:animate-pulse" />
          <circle cx="40" cy="220" r="3.5" fill="#FF7A00" opacity="0.8" />
          <circle cx="360" cy="60" r="4" fill="url(#nodeGlowTeal)" className="motion-safe:animate-pulse" />
          <circle cx="300" cy="150" r="5.5" fill="#00E5CC" className="motion-safe:animate-pulse" />
          <circle cx="370" cy="260" r="3.5" fill="#00E5CC" opacity="0.8" />
          <circle cx="30" cy="350" r="3" fill="#94a3b8" opacity="0.6" />
          <circle cx="380" cy="330" r="3" fill="#94a3b8" opacity="0.6" />
        </svg>
      </div>

      {children}
    </div>
  );
}

// ================= HERO LEFT =================
const SOCIAL_PROOF_GRADIENT_FALLBACKS = [
  "h-7 w-7 rounded-full border-2 border-white bg-gradient-to-tr from-[#06151C] to-[#FF5E14]",
  "h-7 w-7 rounded-full border-2 border-white bg-gradient-to-tr from-[#FF5E14] to-[#00A896]",
  "h-7 w-7 rounded-full border-2 border-white bg-gradient-to-tr from-[#00A896] to-[#06151C]",
];

function resolveHeroAssetUrl(url) {
  if (!url || typeof url !== "string") return "";
  const u = url.trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return `${API_URL}${u.startsWith("/") ? "" : "/"}${u}`;
}

const FALLBACK_HERO_LEFT = {
  badgeLabel: "Technology • Product • Growth",
  headlineLine1: "Build Skills.",
  headlineLine2: "Build Solutions.",
  bodyParagraph1:
    "At Grow Skills Tech Pvt. Ltd., we don't just build software—we create scalable digital solutions that help businesses grow. Our team combines innovative technology, modern design, and industry expertise to deliver reliable, secure, and high-performance applications.",
  highlightPhrase: "Grow Skills Tech Pvt. Ltd.",
  bodyParagraph2:
    "From startups to enterprises, we transform ideas into powerful digital products that improve efficiency, automate processes, and accelerate business growth.",
  bulletPoints: [
    "Custom Web Application Development tailored to your business needs.",
    "Modern Android & iOS Mobile App Development with seamless user experience.",
    "End-to-end Software Development, from planning and UI/UX to deployment and maintenance.",
    "Professional IT Consulting & Digital Transformation solutions for businesses.",
    "Secure, scalable, and cloud-ready architectures using the latest technologies.",
    "Ongoing Software Maintenance, Support & Performance Optimization.",
    "Professional IT & Software Development Training to prepare students and professionals for industry careers.",
  ],
  primaryCtaLabel: "Start a Project",
  primaryCtaHref: "#top",
  secondaryCtaLabel: "Join Our Team",
  secondaryCtaPath: "#top",
  socialProofText: "Trusted by founders & marketing teams across India and beyond.",
  socialProofAvatarUrls: [],
};

function renderParagraphWithHighlight(text, phrase) {
  const t = text || "";
  const p = (phrase || "").trim();
  if (!p || !t.includes(p)) {
    return t;
  }
  const i = t.indexOf(p);
  return (
    <>
      {t.slice(0, i)}
      <strong className="text-[#FF7A00] font-semibold">{p}</strong>
      {t.slice(i + p.length)}
    </>
  );
}

function HeroPrimaryCta({ label, href }) {
  const h = href || "#top";
  const isInternalAppPath = h.startsWith("/") && !h.startsWith("//");
  const isHash = h.startsWith("#");
  const className =
    "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] px-5 py-3 text-xs sm:text-[13px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white shadow-[0_18px_45px_rgba(255,94,20,0.4)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(255,94,20,0.6)] transition";
  if (isInternalAppPath) {
    return (
      <Link to={h} className={className}>
        {label}
        <ArrowRight size={16} />
      </Link>
    );
  }
  return (
    <a href={h} onClick={isHash ? (e) => handleSectionNav(e, h) : undefined} className={className}>
      {label}
      <ArrowRight size={16} />
    </a>
  );
}

function HeroLeft({ content }) {
  const c = content && typeof content === "object" ? content : null;
  const badgeLabel = c?.badgeLabel ?? FALLBACK_HERO_LEFT.badgeLabel;
  const headlineLine1 = c?.headlineLine1 ?? FALLBACK_HERO_LEFT.headlineLine1;
  const headlineLine2 = c?.headlineLine2 ?? FALLBACK_HERO_LEFT.headlineLine2;
  const bodyParagraph1 = c?.bodyParagraph1 ?? FALLBACK_HERO_LEFT.bodyParagraph1;
  const highlightPhrase = c?.highlightPhrase ?? FALLBACK_HERO_LEFT.highlightPhrase;
  const bodyParagraph2 = c?.bodyParagraph2 ?? FALLBACK_HERO_LEFT.bodyParagraph2;
  const points = Array.isArray(c?.bulletPoints) && c.bulletPoints.length > 0 ? c.bulletPoints : FALLBACK_HERO_LEFT.bulletPoints;
  const primaryCtaLabel = c?.primaryCtaLabel ?? FALLBACK_HERO_LEFT.primaryCtaLabel;
  const primaryCtaHref = c?.primaryCtaHref ?? FALLBACK_HERO_LEFT.primaryCtaHref;
  const secondaryCtaLabel = c?.secondaryCtaLabel ?? FALLBACK_HERO_LEFT.secondaryCtaLabel;
  const secondaryCtaPath = c?.secondaryCtaPath ?? FALLBACK_HERO_LEFT.secondaryCtaPath;
  const socialProofText = c?.socialProofText ?? FALLBACK_HERO_LEFT.socialProofText;
  const rawAvatarPaths =
    Array.isArray(c?.socialProofAvatarUrls) && c.socialProofAvatarUrls.length > 0
      ? c.socialProofAvatarUrls
      : FALLBACK_HERO_LEFT.socialProofAvatarUrls;
  const avatarSlots = [0, 1, 2].map((i) => {
    const path = String(rawAvatarPaths?.[i] || "").trim();
    return path ? resolveHeroAssetUrl(path) : null;
  });

  return (
    <div className="space-y-6 sm:space-y-7 lg:space-y-8">
      <Reveal className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 shadow-sm backdrop-blur-md">
          <span className="inline-flex h-2 w-2 rounded-full bg-[#FF5E14] animate-pulse shadow-[0_0_12px_rgba(255,94,20,0.9)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.22em] text-white">{badgeLabel}</span>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="space-y-4 lg:space-y-5">
        <h1 className="text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.4rem] xl:text-[3.7rem] font-bold tracking-tight text-white leading-[1.1] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
          <span className="text-white">{headlineLine1}</span>
          <br />
          <span className="bg-gradient-to-r from-[#FF5E14] via-[#FF8800] to-[#00A896] bg-clip-text text-transparent">{headlineLine2}</span>
        </h1>

        <div className="max-w-xl space-y-4">
          <p className="text-sm sm:text-base md:text-[15px] text-slate-100 leading-relaxed">
            {renderParagraphWithHighlight(bodyParagraph1, highlightPhrase)}
          </p>
          <p className="text-sm sm:text-base md:text-[15px] text-slate-200 leading-relaxed italic border-l-2 border-[#00A896] pl-4 bg-white/5 py-1.5 rounded-r-lg">
            {bodyParagraph2}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <ul className="space-y-3 sm:space-y-4">
          {points.map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm sm:text-[15px] text-slate-100">
              <span className="mt-0.5">
                <CheckCircle2 size={18} className="text-[#FF5E14] drop-shadow-[0_0_10px_rgba(255,94,20,0.6)]" />
              </span>
              <span className="leading-relaxed">{text}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.15} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-2">
        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
          <HeroPrimaryCta label={primaryCtaLabel} href={primaryCtaHref} />

          <a
            href="#services"
            onClick={(e) => handleSectionNav(e, "#services")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white hover:bg-white/10 hover:border-white/40 transition"
          >
            Explore Services
          </a>

          {secondaryCtaPath.startsWith("#") ? (
            <a
              href={secondaryCtaPath}
              onClick={(e) => handleSectionNav(e, secondaryCtaPath)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#00A896]/60 bg-[#00A896]/15 px-5 py-3 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#00E5CC] hover:bg-[#00A896]/30 transition"
            >
              <Users size={16} />
              {secondaryCtaLabel}
            </a>
          ) : (
            <Link
              to={secondaryCtaPath}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#00A896]/60 bg-[#00A896]/15 px-5 py-3 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#00E5CC] hover:bg-[#00A896]/30 transition"
            >
              <Users size={16} />
              {secondaryCtaLabel}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {avatarSlots.map((src, i) =>
              src ? (
                <img key={i} src={src} alt="" className="h-7 w-7 rounded-full border-2 border-[#06151C] object-cover" />
              ) : (
                <div key={i} className={SOCIAL_PROOF_GRADIENT_FALLBACKS[i]} />
              )
            )}
          </div>
          <p className="text-[11px] text-slate-200 font-medium leading-snug max-w-full sm:max-w-[170px]">{socialProofText}</p>
        </div>
      </Reveal>
    </div>
  );
}

// ================= HERO METRICS STRIP =================
function HeroMetrics() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const items = [
    { label: "Projects Shipped", value: "150+" },
    { label: "Average Efficiency Growth", value: "45%" },
    { label: "Client Retention Rate", value: "95%" },
    { label: "Custom Solutions Built", value: "100%" },
  ];

  return (
    <section ref={ref} className="mt-10 lg:mt-14">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-4 sm:px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="border-t border-white/10 pt-3 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/10 sm:pl-4 sm:first:border-l-0 sm:first:pl-0"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-1 font-semibold">{item.label}</p>
              <CountUpValue
                value={item.value}
                active={inView}
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#FF5E14] to-[#00E5CC] bg-clip-text text-transparent"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= section chrome helper ================= */
function SectionShell({ id, className = "", children }) {
  return (
    <section id={id} className={`relative border-t border-white/[0.06] bg-[#06151C] py-14 sm:py-16 lg:py-20 text-slate-200 ${className}`}>
      <GridBackdrop />
      {children}
    </section>
  );
}

// ================= ABOUT =================
function AboutSection({ content }) {
  const stats = Array.isArray(content?.stats) ? content.stats : [];

  return (
    <SectionShell id="about" className="bg-[#081D26]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start gap-10 lg:gap-14">
          <Reveal className="flex-1 space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF7A00]">
              {content?.sectionLabel || "About Grow Skills Tech"}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold tracking-tight text-white">
              {content?.heading || "A product-minded partner, not just another agency."}
            </h2>
            <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed">
              {content?.descriptionOne ||
                "We blend strategy, design and engineering to help ambitious brands launch and scale digital experiences that feel sharp, fast and effortless to use. Every project is handled by a compact senior team - no unnecessary layers, no copy-paste templates."}
            </p>
            <p className="text-sm sm:text-[15px] text-slate-400 leading-relaxed">
              {content?.descriptionTwo ||
                "From early-stage startups to established enterprises, we plug into your teams as a long-term product & growth partner, shipping improvements in tight feedback loops instead of one-off campaigns."}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="w-full md:w-[40%] space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 sm:px-5 py-4 sm:py-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#FF5E14]/15 blur-3xl" aria-hidden="true" />
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#00E5CC] font-bold mb-3">Company Snapshot</p>
              <div className="space-y-3.5">
                {stats.length > 0
                  ? stats.map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="mt-0.5 h-6 w-6 rounded-xl bg-gradient-to-br from-[#FF5E14] to-[#008C95] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
                          &#9679;
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{item.value}</p>
                          <p className="text-[12px] text-slate-400">{item.label}</p>
                        </div>
                      </div>
                    ))
                  : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-6 w-6 rounded-xl bg-gradient-to-br from-[#FF5E14] to-[#008C95] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">&#9679;</div>
                        <div>
                          <p className="text-sm font-bold text-white">5+</p>
                          <p className="text-[12px] text-slate-400">Years building digital products</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-6 w-6 rounded-xl bg-gradient-to-br from-[#FF5E14] to-[#008C95] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">&#9679;</div>
                        <div>
                          <p className="text-sm font-bold text-white">30+</p>
                          <p className="text-[12px] text-slate-400">Industries & categories</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 h-6 w-6 rounded-xl bg-gradient-to-br from-[#FF5E14] to-[#008C95] flex items-center justify-center text-[11px] font-bold text-white shadow-sm">&#9679;</div>
                        <div>
                          <p className="text-sm font-bold text-white">End-to-end</p>
                          <p className="text-[12px] text-slate-400">Strategy, design, build & grow</p>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#00A896]/25 bg-[#00A896]/10 px-4 py-3.5 flex items-start gap-3">
              <div className="mt-0.5">
                <Zap size={18} className="text-[#FF7A00]" />
              </div>
              <p className="text-[12px] text-slate-200 leading-relaxed">
                {content?.ctaText || "Priority slots available for"}{" "}
                <span className="font-bold text-[#00E5CC]">{content?.ctaHighlightText || "Q2 2026 product launches"}</span>. Connect with
                us early to accelerate your project timeline.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

// ================= EXPERTISE GRID =================
const EXPERTISE_ICON_MAP = { Code, Palette, TrendingUp, Smartphone, Target, Lightbulb, Users, Globe };

function ExpertiseSection({ content }) {
  const items =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : [
          { iconKey: "Target", title: "Product Engineering", desc: "Modern, maintainable codebases with performance budgets, CI and observability baked-in from day one." },
          { iconKey: "Palette", title: "Experience Design", desc: "Interfaces that feel clean, confident and premium - always designed around business KPIs & real user journeys." },
          { iconKey: "TrendingUp", title: "Growth & Acquisition", desc: "SEO foundations, landing page experiments and analytics that tie every experiment back to revenue." },
          { iconKey: "Smartphone", title: "Multi-device Experiences", desc: "From mobile-first web to native apps, we make sure your brand feels consistent and high-end everywhere." },
        ];

  return (
    <SectionShell id="expertise">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF7A00] mb-2">
              {content?.sectionLabel || "What we are good at"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {content?.heading || "Product, design & growth under one roof."}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-xl text-[13px] sm:text-sm text-slate-400 leading-relaxed">
              {content?.description ||
                "Every engagement is led by senior talent across strategy, design and engineering - so decisions are coherent, fast and impact-driven, instead of being spread across disconnected vendors."}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {items.map((item, i) => {
            const Icon = EXPERTISE_ICON_MAP[item.iconKey] || Code;
            const num = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#FF5E14]/50 hover:-translate-y-1.5 hover:bg-white/[0.05] transition duration-300">
                  <div
                    className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-[#FF5E14]/0 to-[#00A896]/0 opacity-0 blur-3xl transition duration-500 group-hover:from-[#FF5E14]/25 group-hover:to-[#00A896]/20 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="relative flex items-start justify-between mb-4">
                    <span className="text-3xl font-black text-white/10 group-hover:text-white/20 transition-colors">{num}</span>
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#FF5E14] via-[#FF7A00] to-[#008C95] flex items-center justify-center text-white shadow-[0_10px_25px_rgba(255,94,20,0.35)] group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="relative text-base sm:text-lg font-bold text-white group-hover:text-[#FF8800] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="relative text-[13px] sm:text-sm text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                  <span className="relative inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#00E5CC]">
                    Learn more
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

// ================= SERVICES (large premium panels) =================
const SERVICE_ICON_MAP = { Code, Palette, TrendingUp, Smartphone, Target, Lightbulb, Users, Globe };

function ServicesSection({ content }) {
  const services =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : [
          {
            iconKey: "Code",
            title: "Web & Web App Development",
            desc: "Robust, fast experiences on modern stacks with clean architecture and maintainable code.",
            features: ["Marketing & product websites", "Custom dashboards & portals", "API & third-party integrations", "Performance & security checks"],
          },
          {
            iconKey: "Smartphone",
            title: "Mobile Applications",
            desc: "Native-feeling mobile apps and PWAs tailored to your business and user context.",
            features: ["iOS / Android applications", "React Native / hybrid apps", "App store optimisation", "Usage analytics & funnels"],
          },
          {
            iconKey: "TrendingUp",
            title: "Digital Marketing",
            desc: "From SEO foundations to performance campaigns and CRO - everything connected to revenue.",
            features: ["Search & content strategy", "Landing page optimisation", "Performance marketing setups", "Analytics instrumentation"],
          },
          {
            iconKey: "Palette",
            title: "Brand & Product Design",
            desc: "Interfaces and visual systems that feel premium, timeless and conversion-focused.",
            features: ["Design systems & UI libraries", "UX research & flows", "Interaction & motion design", "Brand identity refresh"],
          },
          {
            iconKey: "Users",
            title: "IT Training & Development",
            desc: "Practical, industry-aligned training programs that turn learners into job-ready developers.",
            features: ["Full-stack developer bootcamps", "Mentor-led project training", "Corporate & campus batches", "Placement-focused curriculum"],
          },
        ];
  const ctaLabel = content?.ctaLabel || "Explore this service";

  return (
    <SectionShell id="services" className="bg-[#081D26]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#00E5CC]">
              <span>{content?.sectionBadgeLabel || "Services"}</span>
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {content?.heading || "Everything you need to go from idea to impact."}
            </h2>
            <p className="mt-3 text-sm sm:text-[15px] text-slate-400 leading-relaxed">
              {content?.description || "We can own the full journey or plug into existing teams for specific streams like growth, design or engineering."}
            </p>
          </Reveal>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {services.map((service, index) => {
            const Icon = SERVICE_ICON_MAP[service.iconKey] || Code;
            const features = Array.isArray(service.features) ? service.features : [];
            const num = String(index + 1).padStart(2, "0");
            return (
              <Reveal key={`${service.title}-${index}`} delay={index * 0.05}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#FF5E14]/50 hover:bg-white/[0.05] transition duration-300">
                  <div className="grid md:grid-cols-[auto_1fr_auto] items-center gap-5 sm:gap-8 px-5 sm:px-8 py-6 sm:py-8">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className="text-2xl sm:text-3xl font-black text-white/10 group-hover:text-[#FF5E14]/40 transition-colors">{num}</span>
                      <div className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br from-[#FF5E14] via-[#FF7A00] to-[#008C95] flex items-center justify-center text-white shadow-[0_10px_25px_rgba(255,94,20,0.35)] group-hover:scale-110 transition-transform">
                        <Icon size={22} />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#FF8800] transition-colors mb-1.5">
                        {service.title}
                      </h3>
                      <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed mb-3 max-w-2xl">{service.desc}</p>
                      <ul className="flex flex-wrap gap-2">
                        {features.map((feature, fi) => (
                          <li
                            key={`${feature}-${fi}`}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-slate-300"
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className="justify-self-start md:justify-self-end inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5CC] group-hover:text-[#FF7A00] transition-colors whitespace-nowrap"
                    >
                      {ctaLabel}
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="h-0.5 w-0 bg-gradient-to-r from-[#FF5E14] to-[#00A896] transition-all duration-500 group-hover:w-full" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

// ================= CASE STUDY STRIP =================
function CaseStudyStrip({ content }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const metrics = Array.isArray(content?.metrics) && content.metrics.length > 0
    ? content.metrics
    : [
        { label: "Conversion Increase", value: "+150%" },
        { label: "CAC", value: "-42%" },
        { label: "Impact", value: "90 Days" },
      ];

  return (
    <SectionShell id="case-study">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B2530] via-[#081D26] to-[#0B2530] px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FF5E14]/15 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#00A896]/15 blur-3xl" aria-hidden="true" />

            <div className="relative grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FF7A00] mb-3">
                  {content?.sectionLabel || "Case Study"}
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight">
                  {content?.heading || "Marketplace Growth Transformation"}
                </h3>
                <p className="mt-4 max-w-lg text-sm sm:text-[15px] text-slate-300 leading-relaxed">
                  {content?.description ||
                    "By re-architecting the onboarding flow, speeding up the front-end and aligning landing messaging with real search intent, we helped a commerce brand unlock significantly better unit economics."}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00E5CC]">
                  View Case Study
                  <ArrowRight size={15} />
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {metrics.map((m, index) => (
                  <div
                    key={`${m.label}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 sm:px-4 py-5 sm:py-6 text-center"
                  >
                    <CountUpValue
                      value={m.value}
                      active={inView}
                      className="block text-lg sm:text-2xl font-black bg-gradient-to-r from-[#FF7A00] to-[#00E5CC] bg-clip-text text-transparent"
                    />
                    <p className="mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-slate-400 leading-tight">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ================= WHY GROW SKILLS TECH =================
function WhyUsSection() {
  const points = [
    { icon: Target, title: "Business-first engineering", desc: "Every technical decision is weighed against the business outcome it drives, not just the technology trend." },
    { icon: Layers, title: "End-to-end execution", desc: "Strategy, design, engineering and growth handled by one accountable team instead of disconnected vendors." },
    { icon: ShieldCheck, title: "Scalable architecture", desc: "Systems built to handle real growth - secure, cloud-ready and maintainable well past launch day." },
    { icon: Rocket, title: "Transparent delivery", desc: "Clear sprint cadences, honest timelines and constant visibility into what is shipping and why." },
  ];

  return (
    <SectionShell className="bg-[#081D26]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-10 sm:mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF7A00] mb-2">Why Us</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Why teams choose Grow Skills Tech</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.06} className="bg-[#06151C] p-6 sm:p-7 h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-white/10">{String(i + 1).padStart(2, "0")}</span>
                  <Icon size={22} className="text-[#00E5CC]" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed">{p.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

// ================= PROCESS (connected scroll timeline) =================
function ProcessSection({ content }) {
  const steps =
    Array.isArray(content?.steps) && content.steps.length > 0
      ? content.steps
      : [
          { label: "01", title: "Discovery & Alignment", desc: "Understand your product, market, constraints and success metrics in a structured workshop." },
          { label: "02", title: "Experience & Architecture", desc: "Translate strategy into information architecture, user journeys and a scalable design system." },
          { label: "03", title: "Build, Test & Launch", desc: "Ship in iterative sprints with QA, performance checks and stakeholder reviews baked into the cadence." },
          { label: "04", title: "Measure & Optimise", desc: "Track real-world usage, identify friction and continuously refine to unlock compounding ROI." },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { root: null, rootMargin: "-35% 0px -45% 0px", threshold: 0 }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <SectionShell id="process">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#00E5CC] mb-2">
              {content?.sectionLabel || "How we work"}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {content?.heading || "A calm, transparent delivery process."}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-xl text-[13px] sm:text-sm text-slate-400 leading-relaxed">
              {content?.description ||
                "No chaos, no guessing. You always know what is being shipped this week, what is blocked and what the expected impact looks like."}
            </p>
          </Reveal>
        </div>

        <div className="relative max-w-2xl mx-auto md:max-w-none">
          {/* connecting line */}
          <div className="absolute left-[19px] sm:left-[23px] top-2 bottom-2 w-px bg-white/10" aria-hidden="true">
            <div
              className="w-full bg-gradient-to-b from-[#FF5E14] to-[#00A896] transition-all duration-500 ease-out"
              style={{ height: `${(activeIndex / Math.max(steps.length - 1, 1)) * 100}%` }}
            />
          </div>

          <div className="space-y-8 sm:space-y-10">
            {steps.map((step, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={step.label || i}
                  ref={(el) => (stepRefs.current[i] = el)}
                  data-index={i}
                  className="relative pl-14 sm:pl-16"
                >
                  <div
                    className={`absolute left-0 top-0 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border text-xs sm:text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "border-[#FF5E14] bg-gradient-to-br from-[#FF5E14] to-[#008C95] text-white shadow-[0_10px_30px_rgba(255,94,20,0.45)] scale-105"
                        : "border-white/15 bg-[#06151C] text-slate-400"
                    }`}
                  >
                    {step.label || String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className={`rounded-2xl border px-5 sm:px-6 py-5 transition-all duration-300 ${
                      isActive
                        ? "border-[#00A896]/40 bg-white/[0.05] translate-x-0 opacity-100"
                        : "border-white/10 bg-white/[0.02] opacity-70"
                    }`}
                  >
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">{step.title}</h3>
                    <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

// ================= TRAINING =================
function TrainingSection({ settings }) {
  const tracks = [
    "Full Stack Development",
    "React / Next.js",
    "Node.js",
    "Python",
    "Mobile App Development",
    "AI & Automation",
    "Digital Marketing",
  ];

  return (
    <SectionShell className="bg-[#081D26] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF7A00] mb-4">
              <GraduationCap size={13} />
              Training
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Learn today.
              <br />
              Build tomorrow.
            </h2>
            <p className="mt-4 max-w-lg text-sm sm:text-[15px] text-slate-400 leading-relaxed">
              Grow Skills Tech is a technology company and a training company. Our mentor-led, project-first programs
              prepare students and professionals for real industry careers.
            </p>
            <a
              href="#top"
              onClick={(e) => handleSectionNav(e, "top")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#008C95] via-[#00A896] to-[#FF7A00] px-5 py-3 text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_15px_35px_rgba(0,140,149,0.35)] hover:-translate-y-0.5 transition"
            >
              Explore Training Programs
              <ArrowRight size={16} />
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {tracks.map((track, i) => (
                <div
                  key={track}
                  className={`group rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 hover:border-[#00A896]/50 hover:bg-white/[0.06] transition duration-300 ${
                    i === tracks.length - 1 ? "col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu size={16} className="text-[#00E5CC] shrink-0" />
                    <span className="text-[13px] sm:text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                      {track}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}

// ================= FAQ =================
function FAQSection({ content }) {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : [
          { question: "What is a typical project timeline?", answer: "Smaller marketing sites can be delivered in 3-5 weeks. Product builds and complex platforms usually run between 8-16 weeks depending on scope." },
          { question: "Do you only work with Indian companies?", answer: "No - while a lot of our clients are India-first businesses, we also work with teams in the Middle East, Europe and South-East Asia across time zones." },
          { question: "Can you work with our in-house dev or marketing team?", answer: "Absolutely. Many engagements are hybrid - we own UX/UI and architecture while your teams manage engineering or growth, or vice-versa." },
          { question: "How do we get started?", answer: "Share a short brief using the form above or email us. We usually respond within 24 hours with a rough scope, ballpark and next steps." },
        ];

  return (
    <SectionShell id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal className="text-center mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#FF7A00] mb-2">{content?.sectionLabel || "Questions"}</p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{content?.heading || "A few things teams often ask us."}</h2>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const q = faq.question || "";
            const a = faq.answer || "";
            return (
              <Reveal key={`${q}-${i}`} delay={i * 0.04}>
                <div
                  className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
                    isOpen ? "border-[#FF5E14]/40 bg-white/[0.05]" : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-[15px] font-bold text-white">{q}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen ? "border-[#FF5E14] bg-[#FF5E14]/15 text-[#FF7A00] rotate-45" : "border-white/20 text-slate-400"
                      }`}
                    >
                      <Plus size={15} />
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden px-5 pb-4">
                      <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed border-t border-white/10 pt-3">{a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

// ================= FINAL CTA =================
function FinalCtaSection({ settings }) {
  const waLink = buildWhatsAppLink(
    settings.contactPhone || "+917470834876",
    "Hi Grow Skills Tech, I'd like to talk about a project."
  );

  return (
    <SectionShell className="bg-[#081D26]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B2530] via-[#06151C] to-[#0B1E14] px-6 sm:px-12 lg:px-16 py-14 sm:py-20 text-center">
            <GridBackdrop />
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-[#FF5E14]/15 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] rounded-full bg-[#00A896]/15 blur-3xl" aria-hidden="true" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-[#00E5CC] mb-6">
                <Sparkles size={13} />
                Let's talk
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Have an idea?
                <br />
                Let's build it.
              </h2>
              <p className="mt-5 max-w-xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
                Tell us what you're building and we'll help you turn it into a scalable digital product.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#top"
                  onClick={(e) => handleSectionNav(e, "top")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_45px_rgba(255,94,20,0.4)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(255,94,20,0.6)] transition"
                >
                  Start a Project
                  <ArrowRight size={16} />
                </a>
                {waLink ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-white/10 hover:border-[#00E5CC]/50 transition"
                  >
                    <MessageCircle size={16} className="text-[#00E5CC]" />
                    Talk on WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

// ================= FOOTER =================
function FooterSection({ settings }) {
  const socialIcons = [
    { Icon: Facebook, href: settings.socialLinks?.facebook || "#", label: "Facebook" },
    { Icon: Instagram, href: settings.socialLinks?.instagram || "#", label: "Instagram" },
    { Icon: Linkedin, href: settings.socialLinks?.linkedin || "#", label: "LinkedIn" },
    { Icon: Twitter, href: settings.socialLinks?.twitter || "#", label: "Twitter" },
    { Icon: Youtube, href: settings.socialLinks?.youtube || "#", label: "YouTube" },
  ];

  return (
    <footer className="border-t border-[#00A896]/20 bg-[#050E13] py-12 text-slate-300">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#FFF0E6] via-[#FFB380] to-[#FF5E14] p-1.5 rounded-xl border border-white/50 shadow-md">
                <img src={logo} alt="Grow Skills Tech Pvt. Ltd." className="w-8 h-8 object-contain" />
              </div>
              <div>
                <p className="text-base font-bold text-white uppercase tracking-[0.12em]">
                  {settings.companyName || "Grow Skills Tech"}
                </p>
                <p className="hidden sm:block text-[11px] text-[#FF7A00] tracking-[0.18em] uppercase font-semibold">
                  {settings.tagline || "Innovation. Technology. Growth."}
                </p>
              </div>
            </div>
            <p className="text-[13px] sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Grow Skills Tech Pvt. Ltd. empowers ambitious businesses by building cutting-edge web platforms, custom software solutions, and high-impact digital experiences.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="inline-flex items-center gap-2">
                <Phone size={14} className="text-[#FF7A00]" />
                {settings.contactPhone || "+917470834876"}
              </p>
              <p className="inline-flex items-center gap-2 pl-1">
                <Mail size={14} className="text-[#FF7A00]" />
                {settings.contactEmail || "growskillstech@gmail.com"}
              </p>
            </div>
            <div className="flex items-center gap-2.5 pt-1">
              {socialIcons.map(({ Icon, href, label }, idx) => (
                <a
                  key={idx}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-slate-300 hover:border-[#FF5E14] hover:bg-[#FF5E14] hover:text-white transition duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#00E5CC]">Quick Navigation</p>
            <ul className="space-y-2 text-[13px] sm:text-sm text-slate-400">
              <li>
                <a href="#about" onClick={(e) => handleSectionNav(e, "about")} className="hover:text-[#FF7A00] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#expertise" onClick={(e) => handleSectionNav(e, "expertise")} className="hover:text-[#FF7A00] transition-colors">
                  Our Expertise
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleSectionNav(e, "services")} className="hover:text-[#FF7A00] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#process" onClick={(e) => handleSectionNav(e, "process")} className="hover:text-[#FF7A00] transition-colors">
                  Workflow Process
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleSectionNav(e, "faq")} className="hover:text-[#FF7A00] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/partner" className="hover:text-[#FF7A00] transition-colors">
                  Partner
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3.5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#00E5CC]">Tech & Growth Digest</p>
            <p className="text-[13px] sm:text-sm text-slate-400">
              Subscribe to get latest software engineering updates and tech innovation insights.
            </p>
            <form className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="!h-[42px] !min-h-[42px] flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/50 focus:border-[#FF5E14]"
                />
                <button
                  type="button"
                  className="!h-[42px] !min-h-[42px] inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FF5E14] to-[#008C95] px-4 text-xs font-bold uppercase tracking-[0.15em] text-white hover:opacity-90 transition shadow-md"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] pt-6 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Grow Skills Tech Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href={settings.legalLinks?.privacy || "#"} className="hover:text-[#FF7A00] transition-colors">
              Privacy Policy
            </a>
            <a href={settings.legalLinks?.terms || "#"} className="hover:text-[#FF7A00] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
