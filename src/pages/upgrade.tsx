'use client'
import { useRouter } from 'next/router'
import BottomNav from '../components/BottomNav'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: '',
    stars: null,
    features: [
      '3 scans total',
      'Basic risk flags (5 clauses)',
      'Overall risk verdict',
      'Standard processing',
    ],
    cta: 'Current plan',
    disabled: true,
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '2,200',
    period: '/month',
    stars: 2200,
    features: [
      '20 scans per month',
      'Full analysis (10 clauses)',
      'Confidence scores',
      'Negotiation messages',
      'ELI5 plain-English mode',
      'PDF export',
    ],
    cta: 'Get Starter',
    disabled: false,
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '5,800',
    period: '/month',
    stars: 5800,
    features: [
      'Unlimited scans',
      'Full analysis (10 clauses)',
      'Custom playbooks',
      'Priority processing',
      '5 team seats',
      'Clause comparison benchmarks',
      'Priority support',
    ],
    cta: 'Get Pro',
    disabled: false,
    highlight: true,
  },
]

export default function UpgradePage() {
  const router = useRouter()

  function handleUpgrade(planId: string, stars: number | null) {
    if (!stars) return
    // In production: trigger Telegram Stars payment via bot
    // For now: redirect back to bot
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'clauseIQ_bot'
    window.open(`https://t.me/${botUsername}?start=subscribe_${planId}`, '_blank')
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 100 }}>

      <div style={{ padding: '20px 20px 0' }}>
        <button
          onClick={() => router.back()}
          style={{
            fontSize: 13, color: 'var(--text-secondary)',
            background: 'none', border: 'none', cursor: 'pointer',
            marginBottom: 16, fontFamily: 'var(--font-body)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          ← Back
        </button>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 6,
        }}>
          Upgrade ClauseIQ
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
          Get deeper insights and unlimited contract scanning.
          Paid via Telegram Stars — no card needed.
        </div>

        {PLANS.map((plan, i) => (
          <div
            key={plan.id}
            className="animate-fade-up"
            style={{
              background: plan.highlight ? 'rgba(245,158,11,0.05)' : 'var(--bg-card)',
              border: `1px solid ${plan.highlight ? 'var(--accent)' : 'var(--border-subtle)'}`,
              borderRadius: 16,
              padding: '18px',
              marginBottom: 12,
              position: 'relative',
              animationDelay: `${i * 0.08}s`,
              opacity: 0,
            }}
          >
            {plan.highlight && (
              <div style={{
                position: 'absolute', top: -10, left: 16,
                background: 'var(--accent)',
                color: '#000', fontSize: 10, fontWeight: 700,
                padding: '2px 10px', borderRadius: 20,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Most Popular
              </div>
            )}

            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', marginBottom: 14,
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17, fontWeight: 700,
                  color: 'var(--text-primary)', marginBottom: 2,
                }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: plan.stars ? 22 : 18,
                    fontWeight: 700,
                    color: plan.highlight ? 'var(--accent)' : 'var(--text-primary)',
                  }}>
                    {plan.stars ? `⭐ ${plan.price}` : 'Free'}
                  </span>
                  {plan.period && (
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      Stars{plan.period}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(plan.id, plan.stars)}
                disabled={plan.disabled}
                style={{
                  padding: '9px 16px',
                  background: plan.disabled
                    ? 'var(--bg-input)'
                    : plan.highlight
                      ? 'var(--accent)'
                      : 'var(--bg-card)',
                  border: `1px solid ${plan.disabled ? 'var(--border-subtle)' : plan.highlight ? 'var(--accent)' : 'var(--border-medium)'}`,
                  borderRadius: 10,
                  color: plan.disabled ? 'var(--text-muted)' : plan.highlight ? '#000' : 'var(--text-primary)',
                  fontSize: 12, fontWeight: 600,
                  cursor: plan.disabled ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s ease',
                }}
              >
                {plan.cta}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {plan.features.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, color: 'var(--text-secondary)',
                }}>
                  <span style={{ color: plan.highlight ? 'var(--accent)' : 'var(--risk-low)', flexShrink: 0 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{
          fontSize: 11, color: 'var(--text-muted)',
          textAlign: 'center', lineHeight: 1.6, marginTop: 8,
        }}>
          Payments processed by Telegram Stars.<br />
          Cancel anytime. No hidden fees.
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  )
}
