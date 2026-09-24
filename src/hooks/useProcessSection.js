import { useCallback, useEffect, useState } from "react";
import { fetchActiveProcess } from "../services/processService.js";
import { useLiveSectionRefresh } from "./useLiveSectionRefresh.js";

const fallbackProcess = {
  sectionLabel: "How we work",
  heading: "A calm, transparent delivery process.",
  description:
    "No chaos, no guessing. You always know what is being shipped this week, what is blocked and what the expected impact looks like.",
  steps: [
    {
      label: "01",
      title: "Discovery & alignment",
      desc: "Understand your product, market, constraints and success metrics in a structured workshop.",
    },
    {
      label: "02",
      title: "Experience & architecture",
      desc: "Translate strategy into information architecture, user journeys and a scalable design system.",
    },
    {
      label: "03",
      title: "Build, test & launch",
      desc: "Ship in iterative sprints with QA, performance checks and stakeholder reviews baked into the cadence.",
    },
    {
      label: "04",
      title: "Measure & optimise",
      desc: "Track real-world usage, identify friction and continuously refine to unlock compounding ROI.",
    },
  ],
  isVisible: true,
  publishStatus: "published",
};

export function useProcessSection() {
  const [processData, setProcessData] = useState(null);

  const load = useCallback(() => {
    fetchActiveProcess()
      .then((data) => setProcessData(data))
      .catch(() => setProcessData(fallbackProcess));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useLiveSectionRefresh("process", load);

  const shouldRender =
    Boolean(processData) &&
    processData.isVisible !== false &&
    String(processData.publishStatus || "").toLowerCase() === "published";

  return { processData, shouldRender };
}
