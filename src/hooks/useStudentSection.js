import { useCallback, useState } from 'react'

/** Lightweight section navigation helper for student dashboard modules */
export function useStudentSection(initial = 'Dashboard') {
  const [activeSection, setActiveSection] = useState(initial)
  const goTo = useCallback((section) => setActiveSection(section), [])
  return { activeSection, setActiveSection, goTo }
}
