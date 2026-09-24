import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MASTER_ADMIN_THEME_KEY } from '../../utils/masterAdminAuth.js'

const MasterAdminThemeContext = createContext(null)

function readStoredTheme() {
  try {
    return localStorage.getItem(MASTER_ADMIN_THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function MasterAdminThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme)

  useEffect(() => {
    try {
      localStorage.setItem(MASTER_ADMIN_THEME_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(typeof next === 'function' ? next : () => next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <MasterAdminThemeContext.Provider value={value}>{children}</MasterAdminThemeContext.Provider>
}

export function useMasterAdminTheme() {
  const ctx = useContext(MasterAdminThemeContext)
  if (!ctx) {
    throw new Error('useMasterAdminTheme must be used within MasterAdminThemeProvider')
  }
  return ctx
}

/** Shell class tokens for master admin dark / light modes */
export function getMasterAdminShell(isDark) {
  if (isDark) {
    return {
      root: 'bg-[#06151C] text-slate-100',
      glow: 'bg-[radial-gradient(circle_at_top,_rgba(0,168,150,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,94,20,0.16),transparent_55%)]',
      grid: 'bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)]',
      overlay: 'bg-[#06151C]/70',
      sidebar: 'border-[#00A896]/30 bg-[#06151C]/95 backdrop-blur-xl',
      brandTitle: 'text-white',
      brandSub: 'text-[#FF7A00]',
      groupLabel: 'text-slate-500 hover:text-slate-300',
      navInactive: 'text-slate-300 hover:bg-white/5 hover:text-[#FF5E14]',
      navChildActive: 'bg-[#00A896]/15 text-[#00E5CC]',
      navChildInactive: 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
      iconBtn:
        'border-[#00A896]/35 bg-white/5 text-slate-200 hover:border-[#FF5E14]/50 hover:text-[#FF5E14]',
      sticky: 'bg-[#06151C]/95',
      mobileBar: 'border-[#00A896]/30 bg-[#06151C]/60 text-white',
      mobileTitle: 'text-white',
      chip: 'border-[#00A896]/35 bg-white/5 text-slate-300',
      search: 'border-[#00A896]/35 bg-[#06151C]/60 text-slate-400',
      searchInput: 'text-slate-200 placeholder:text-slate-500',
      dropdown: 'border-[#00A896]/30 bg-[#06151C] shadow-[0_18px_45px_rgba(0,0,0,0.45)]',
      dropdownMuted: 'text-slate-400',
      dropdownItem: 'border-white/5 bg-white/5',
      dropdownText: 'text-slate-200',
      dropdownMeta: 'text-slate-500',
      menuItem: 'text-slate-200 hover:bg-white/5 hover:text-[#FF5E14]',
      pageTitle: 'text-white',
      pageDesc: 'text-slate-400',
      divider: 'bg-[#00A896]/15',
    }
  }

  return {
    root: 'bg-[#E8F0F2] text-black',
    glow: 'bg-[radial-gradient(circle_at_top,_rgba(0,168,150,0.12),transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,94,20,0.08),transparent_55%)]',
    grid: 'bg-[linear-gradient(to_right,rgba(0,168,150,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)]',
    overlay: 'bg-slate-900/40',
    sidebar: 'border-[#00A896]/25 bg-white/90 backdrop-blur-xl',
    brandTitle: 'text-black',
    brandSub: 'text-[#FF5E14]',
    groupLabel: 'text-black hover:text-black',
    navInactive: 'text-black hover:bg-[#00A896]/8 hover:text-[#FF5E14]',
    navChildActive: 'bg-[#00A896]/15 text-[#008C95]',
    navChildInactive: 'text-black hover:bg-[#00A896]/8 hover:text-[#FF5E14]',
    iconBtn:
      'border-[#00A896]/30 bg-white text-black hover:border-[#FF5E14]/50 hover:text-[#FF5E14]',
    sticky: 'bg-[#E8F0F2]/95',
    mobileBar: 'border-[#00A896]/25 bg-white/80 text-black',
    mobileTitle: 'text-black',
    chip: 'border-[#00A896]/30 bg-[#00A896]/8 text-black',
    search: 'border-[#00A896]/30 bg-white/80 text-black',
    searchInput: 'text-black placeholder:text-black/50',
    dropdown: 'border-[#00A896]/25 bg-white shadow-[0_18px_45px_rgba(6,21,28,0.12)]',
    dropdownMuted: 'text-black',
    dropdownItem: 'border-slate-100 bg-slate-50',
    dropdownText: 'text-black',
    dropdownMeta: 'text-black',
    menuItem: 'text-black hover:bg-[#00A896]/8 hover:text-[#FF5E14]',
    pageTitle: 'text-black',
    pageDesc: 'text-black',
    divider: 'bg-[#00A896]/20',
  }
}
