'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTelegram } from '../hooks/useTelegram'
import { getUser, type User } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

export default function ProfilePage() {
  const router = useRouter()
  const { user: tgUser } = useTelegram()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (tgUser?.id) {
      getUser(tgUser.id).then(setUser).catch(console.error)
    }
  }, [tgUser])

  const tier = user?.subscription_tier || 'free'
  const scansUsed = user?.free_scans_used || 0
  const totalScans = user?.total_scans || 0

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>

        {/* Avatar + name */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '24px 0 20px',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--accent-dim)',
            border: '2px solid var(--accent-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, marginBottom: 12,
          }}>
            {tgUser?.first_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18, fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: 4,
          }}>
            {tgUser?.first_name} {tgUser?.last_name || ''}
          </div>
          {tgUser?.username && (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              @{tgUser.username}
            </div>
          )}
        </div>

        {/* Plan badge */}
        <div style={{
          padding: '14px 16px',
          background: tier === 'free' ? 'var(--bg-card)' : 'var(--accent-dim)',
          border: `1px solid ${tier === 'free' ? 'var(--border-subtle)' : 'var(--accent-glow)'}`,
          borderRadius: 14,
          marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontSize: 11, fontFamily: 'var(--font-mono)',
              color: tier === 'free' ? 'var(--text-muted)' : 'var(--accent)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2,
            }}>
              Current Plan
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16, fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              {tier === 'free' ? 'Free Tier' : tier.charAt(0).toUpperCase() + tier.slice(1)}
            </div>
            {tier === 'free' && (
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                {Math.max(0, 3 - scansUsed)} free scans remaining
              </div>
            )}
            {user?.subscription_expires_at && tier !== 'free' && (
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                Expires {new Date(user.subscription_expires_at).toLocaleDateString()}
              </div>
            )}
          </div>
          {tier === 'free' && (
            <button
              onClick={() => router.push('/upgrade')}
              style={{
                padding: '8px 16px',
                background: 'var(--accent)',
                color: '#000', fontWeight: 600, fontSize: 12,
                border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              Upgrade
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 10, marginBottom: 20,
        }}>
          {[
            { label: 'Total Scans', value: totalScans, icon: '📄' },
            { label: 'Free Used', value: `${Math.min(scansUsed, 3)}/3`, icon: '🆓' },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: '14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12, textAlign: 'center',
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22, fontWeight: 700,
                color: 'var(--text-primary)', marginBottom: 2,
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust & privacy section */}
        <div style={{
          padding: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 14,
          marginBottom: 12,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14, fontWeight: 600,
            color: 'var(--text-primary)', marginBottom: 12,
          }}>
            🔒 Privacy & Security
          </div>
          {[
            { icon: '🔐', title: 'End-to-end encrypted', desc: 'Your contracts are never stored unencrypted' },
            { icon: '🗑️', title: 'Auto-deleted after analysis', desc: 'Raw document text is purged within 24 hours' },
            { icon: '👁️', title: 'We never read your contracts', desc: 'Only AI-extracted metadata is retained' },
            { icon: '🚫', title: 'No third-party sharing', desc: 'Your data is never sold or shared' },
          ].map(item => (
            <div key={item.title} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 0',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Open in bot button */}
        <button
          onClick={() => {
            const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'clauseIQ_bot'
            window.open(`https://t.me/${botUsername}`, '_blank')
          }}
          style={{
            width: '100%',
            padding: '13px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 12,
            color: 'var(--text-secondary)',
            fontSize: 13, fontWeight: 500,
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-body)',
          }}
        >
          ✈️ Open in Telegram Bot
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  )
}
