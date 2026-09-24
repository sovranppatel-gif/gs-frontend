/** Faculty portal helpers */

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)
}

export function clampPercent(value) {
  return Math.max(0, Math.min(100, Number(value) || 0))
}

export const FACULTY_THEME_KEY = '__faculty_theme__'
