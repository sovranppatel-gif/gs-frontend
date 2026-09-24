/** Shared “How did you hear about us?” options (student signup + enquiries). */
export const HEARD_ABOUT_OPTIONS = [
  'Google / Search',
  'Instagram',
  'Facebook',
  'YouTube',
  'WhatsApp',
  'Friend / Family',
  'College / University',
  'Advertisement',
  'Partner / Counsellor',
  'Others',
]

export const HEARD_ABOUT_OPTION_SET = new Set(HEARD_ABOUT_OPTIONS)

export function formatHeardAbout(heardAbout, heardAboutOther) {
  const source = String(heardAbout || '').trim()
  if (!source) return ''
  const other = String(heardAboutOther || '').trim()
  if (source === 'Others' && other) return `Others — ${other}`
  return source
}
