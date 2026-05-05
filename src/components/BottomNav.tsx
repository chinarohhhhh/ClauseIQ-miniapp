'use client'
import { useRouter } from 'next/router'

type NavItem = {
  id: string
  label: string
  path: string
  icon: React.ReactNode
  isPrimary?: boolean
}

function VaultIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 9V7M12 17v-2M9 12H7M17 12h-2"/>
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}

function ScanIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/>
      <rect x="7" y="7" width="10" height="10" rx="1"/>
    </svg>
  )
}

function triggerHaptic() {
  try {
    const tg = (window as any).Telegram?.WebApp
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light')
    }
  } catch {}
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'history',
    label: 'Vault',
    path: '/history',
    icon: <VaultIcon />,
  },
  {
    id: 'home',
    label: 'Scan',
    path: '/',
    icon: <ScanIcon />,
    isPrimary: true,
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: <ProfileIcon />,
  },
]

export default function BottomNav({ active }: { active: string }) {
  const router = useRouter()

  function handleNav(item: NavItem) {
    triggerHaptic()
    router.push(item.path)
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(10,10,15,0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      zIndex: 50,
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id

        if (item.isPrimary) {
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 0 2px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {/* Primary scan button — elevated center CTA */}
              <div style={{
                width: 52, height: 52,
                borderRadius: 16,
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000',
                boxShadow: '0 4px 16px var(--accent-glow)',
                marginBottom: 4,
                transition: 'all 0.2s ease',
                transform: isActive ? 'scale(0.95)' : 'scale(1)',
                marginTop: -16,
              }}>
                {item.icon}
              </div>
              <span style={{
                fontSize: 10,
                fontFamily: 'var(--font-body)',
                color: 'var(--accent)',
                fontWeight: 700,
              }}>
                {item.label}
              </span>
            </button>
          )
        }

        return (
          <button
            key={item.id}
            onClick={() => handleNav(item)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '10px 0 2px',
              background: 'none', border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--accent-glow)' : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              marginBottom: 3,
              transition: 'all 0.2s ease',
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: 10,
              fontFamily: 'var(--font-body)',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: isActive ? 600 : 400,
              transition: 'color 0.2s ease',
            }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}