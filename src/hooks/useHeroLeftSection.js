import { useCallback, useEffect, useState } from "react";
import { fetchActiveHeroLeft } from "../services/heroLeftService.js";
import { useLiveSectionRefresh } from "./useLiveSectionRefresh.js";

const fallbackHeroLeft = {
  badgeLabel: "Join us our team",
  headlineLine1: "Build Skills",
  headlineLine2: "Build Solutions",
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
  primaryCtaLabel: "Book Discovery Call",
  primaryCtaHref: "#top",
  secondaryCtaLabel: "Join Our Team",
  secondaryCtaPath: "#top",
  socialProofText: "Trusted by founders & marketing teams across India and beyond.",
  socialProofAvatarUrls: [],
  isVisible: true,
  publishStatus: "published",
};

export function useHeroLeftSection() {
  const [heroLeftData, setHeroLeftData] = useState(null);

  const load = useCallback(() => {
    fetchActiveHeroLeft()
      .then((data) => setHeroLeftData(data))
      .catch(() => setHeroLeftData(fallbackHeroLeft));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useLiveSectionRefresh("hero-left", load);

  const shouldRender =
    Boolean(heroLeftData) &&
    heroLeftData.isVisible !== false &&
    String(heroLeftData.publishStatus || "").toLowerCase() === "published";

  return { heroLeftData, shouldRender };
}
