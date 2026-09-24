import { useCallback, useEffect, useState } from "react";
import { fetchActiveCaseStudy } from "../services/caseStudyService.js";
import { useLiveSectionRefresh } from "./useLiveSectionRefresh.js";

const fallbackCaseStudy = {
  sectionLabel: "Highlight",
  heading: "150% uplift in conversions for a marketplace within 90 days.",
  description:
    "By re-architecting the onboarding flow, speeding up the front-end and aligning landing messaging with real search intent, we helped a commerce brand unlock significantly better unit economics.",
  snapshotLabel: "Snapshot",
  metrics: [
    { value: "+150%", label: "Conversion rate" },
    { value: "-42%", label: "CAC" },
    { value: "90 days", label: "From kickoff to impact" },
  ],
  isVisible: true,
  publishStatus: "published",
};

export function useCaseStudyStrip() {
  const [caseStudyData, setCaseStudyData] = useState(null);

  const load = useCallback(() => {
    fetchActiveCaseStudy()
      .then((data) => setCaseStudyData(data))
      .catch(() => setCaseStudyData(fallbackCaseStudy));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useLiveSectionRefresh("case-study", load);

  const shouldRender =
    Boolean(caseStudyData) &&
    caseStudyData.isVisible !== false &&
    String(caseStudyData.publishStatus || "").toLowerCase() === "published";

  return { caseStudyData, shouldRender };
}
