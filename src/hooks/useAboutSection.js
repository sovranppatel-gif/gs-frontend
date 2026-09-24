import { useCallback, useEffect, useState } from "react";
import { fetchActiveAbout } from "../services/aboutService.js";
import { useLiveSectionRefresh } from "./useLiveSectionRefresh.js";

const fallbackAbout = {
  sectionLabel: "About Scholars Mediatech",
  heading: "A product-minded partner, not just another agency.",
  descriptionOne:
    "We blend strategy, design and engineering to help ambitious brands launch and scale digital experiences that feel sharp, fast and effortless to use. Every project is handled by a compact senior team - no unnecessary layers, no copy-paste templates.",
  descriptionTwo:
    "From early-stage startups to established enterprises, we plug into your teams as a long-term product and growth partner, shipping improvements in tight feedback loops instead of one-off campaigns.",
  stats: [
    { value: "5+", label: "Years building digital products" },
    { value: "30+", label: "Industries and categories" },
    { value: "End-to-end", label: "Strategy, design, build and grow" },
  ],
  ctaText: "Priority slots available for",
  ctaHighlightText: "Q2 2026 product launches",
  isVisible: true,
  publishStatus: "published",
};

export function useAboutSection() {
  const [aboutData, setAboutData] = useState(null);

  const load = useCallback(() => {
    fetchActiveAbout()
      .then((data) => setAboutData(data))
      .catch(() => setAboutData(fallbackAbout));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useLiveSectionRefresh("about", load);

  const shouldRender =
    Boolean(aboutData) &&
    aboutData.isVisible !== false &&
    String(aboutData.publishStatus || "").toLowerCase() === "published";

  return {
    aboutData,
    shouldRender,
    fallbackAbout,
  };
}
