import { useCallback, useState } from 'react'

/** Lightweight section navigation helper for faculty dashboard modules */
export function useFacultySection(initial = 'Dashboard') {
  const [activeSection, setActiveSection] = useState(initial)
  const goTo = useCallback((section) => setActiveSection(section), [])
  return { activeSection, setActiveSection, goTo }
}
