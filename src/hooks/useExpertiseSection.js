import { useCallback, useEffect, useState } from "react";
import { fetchActiveExpertise } from "../services/expertiseService.js";
import { useLiveSectionRefresh } from "./useLiveSectionRefresh.js";

const fallbackExpertise = {
  sectionLabel: "What we are good at",
  heading: "Product, design & growth under one roof.",
  description:
    "Every engagement is led by senior talent across strategy, design and engineering - so decisions are coherent, fast and impact-driven, instead of being spread across disconnected vendors.",
  items: [
    {
      iconKey: "Target",
      title: "Product-grade engineering",
      desc: "Modern, maintainable codebases with performance budgets, CI and observability baked-in from day one.",
    },
    {
      iconKey: "Palette",
      title: "Interface & experience design",
      desc: "Interfaces that feel clean, confident and premium - always designed around business KPIs & real user journeys.",
    },
    {
      iconKey: "TrendingUp",
      title: "Acquisition & growth",
      desc: "SEO foundations, landing page experiments and analytics that tie every experiment back to revenue.",
    },
    {
      iconKey: "Smartphone",
      title: "Multi-device reality",
      desc: "From mobile-first web to native apps, we make sure your brand feels consistent and high-end everywhere.",
    },
  ],
  isVisible: true,
  publishStatus: "published",
};

export function useExpertiseSection() {
  const [expertiseData, setExpertiseData] = useState(null);

  const load = useCallback(() => {
    fetchActiveExpertise()
      .then((data) => setExpertiseData(data))
      .catch(() => setExpertiseData(fallbackExpertise));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useLiveSectionRefresh("expertise", load);

  const shouldRender =
    Boolean(expertiseData) &&
    expertiseData.isVisible !== false &&
    String(expertiseData.publishStatus || "").toLowerCase() === "published";

  return { expertiseData, shouldRender };
}
