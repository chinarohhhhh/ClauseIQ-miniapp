'use client'
import { useRouter } from 'next/router'

type NavItem = {
  id: string
  label: string
  icon: string
  path: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: '⚡', path: '/' },
  { id: 'history', label: 'Vault', icon: '📂', path: '/history' },
  { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
]

export default function BottomNav({ active }: { active: string }) {
  const router = useRouter()

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(10,10,15,0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      zIndex: 50,
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
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
              width: 36, height: 36, borderRadius: 10,
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--accent-glow)' : 'transparent'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
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
