import { Link } from "react-router-dom";
import { Home, Mail, MapPin, Phone } from "lucide-react";
import logo from "../assets/logo.png";
import landingbg from "../assets/images/landing-bg.jpg";
import SeoHead from "./SeoHead.jsx";
import { logoBox, logoGlow, primaryBtn } from "../utils/masterAdminTheme.js";

const COMPANY = {
  name: "Grow Skills Tech Pvt. Ltd.",
  tagline: "Innovation. Technology. Growth.",
  email: "growskillstech@gmail.com",
  address:
    "2nd floor, Front of Yamaha showroom, above Epson service centre, near Mushran Park, Narsinghpur, Madhya Pradesh 487001",
  contacts: [
    { name: "Er Sovran Singh", phone: "7898474876" },
    { name: "Er Shivam Dixit", phone: "8889246291" },
  ],
};

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="Page Not Found | Grow Skills Tech"
        description="The page you are looking for could not be found. Contact Grow Skills Tech Pvt. Ltd."
        path="/404"
        noindex
        includeWebsiteSchema={false}
      />

      <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <img
            src={landingbg}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#06151C]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,168,150,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,94,20,0.16),transparent_55%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <div className="relative shrink-0">
              <div className={logoGlow} />
              <div className={logoBox}>
                <img src={logo} alt={COMPANY.name} className="h-12 w-12 object-contain" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                {COMPANY.name}
              </p>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[#FF7A00]">
                {COMPANY.tagline}
              </p>
            </div>
          </div>

          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
            <div className="text-center md:text-left">
              <p className="text-7xl font-bold tracking-tight text-white/15 sm:text-8xl">404</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Page{" "}
                <span className="bg-gradient-to-r from-[#FF5E14] via-[#FF8800] to-[#00A896] bg-clip-text text-transparent">
                  Not Found
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm text-slate-300 md:mx-0 mx-auto">
                The URL you entered does not exist. Please check the address or return to the home page.
              </p>
              <Link to="/" className={`${primaryBtn} mt-8 md:inline-flex`}>
                <Home size={16} />
                Back to Home
              </Link>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#00A896]/30 bg-[#06151C]/75 p-5 text-left shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00A896]">
                Contact
              </p>
              <p className="inline-flex items-start gap-2.5 text-sm text-slate-200">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#FF5E14]" />
                <span>{COMPANY.address}</span>
              </p>
              {COMPANY.contacts.map((person) => (
                <a
                  key={person.phone}
                  href={`tel:+91${person.phone}`}
                  className="flex items-start gap-2.5 text-sm text-slate-200 transition hover:text-[#FF5E14]"
                >
                  <Phone size={16} className="mt-0.5 shrink-0 text-[#FF5E14]" />
                  <span>
                    <span className="block font-medium text-white">{person.name}</span>
                    <span className="text-slate-300">+91 {person.phone}</span>
                  </span>
                </a>
              ))}
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-2.5 text-sm text-slate-200 transition hover:text-[#FF5E14]"
              >
                <Mail size={16} className="shrink-0 text-[#FF5E14]" />
                {COMPANY.email}
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
        </div>
      </section>
    </>
  );
}
