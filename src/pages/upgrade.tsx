'use client'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTelegram } from '../hooks/useTelegram'
import BottomNav from '../components/BottomNav'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: '',
    stars: null,
    ton: null,
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
    ton: '4',
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
    ton: '10',
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
  const { tg, user } = useTelegram()
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'stars' | 'ton'>('stars')

  async function handleUpgrade(planId: string, stars: number | null, ton: string | null) {
    if (!stars && !ton) return
    setProcessingPlan(planId)

    try {
      if (paymentMethod === 'stars' && stars) {
        await handleStarsPayment(planId, stars)
      } else if (paymentMethod === 'ton' && ton) {
        await handleTonPayment(planId, ton)
      }
    } catch (e) {
      console.error('Payment error:', e)
    } finally {
      setProcessingPlan(null)
    }
  }

  async function handleStarsPayment(planId: string, stars: number) {
    // Request invoice link from bot API
    const botToken = process.env.NEXT_PUBLIC_BOT_TOKEN
    if (!botToken) {
      // Fallback — open bot directly
      const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'clauseIQ_bot'
      window.open(`https://t.me/${botUsername}?start=subscribe_${planId}`, '_blank')
      return
    }

    try {
      // Create invoice link via Telegram Bot API
      const planLabels: Record<string, string> = {
        starter: 'ClauseIQ Starter — Monthly',
        pro: 'ClauseIQ Pro — Monthly',
      }
      const planDescs: Record<string, string> = {
        starter: '20 scans/month, confidence scores, negotiation messages, PDF export.',
        pro: 'Unlimited scans, custom playbooks, 5 team seats, priority support.',
      }

      const resp = await fetch(
        `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: planLabels[planId] || 'ClauseIQ Subscription',
            description: planDescs[planId] || 'ClauseIQ subscription plan.',
            payload: `subscribe_${planId}`,
            provider_token: '',
            currency: 'XTR',
            prices: [{ label: planLabels[planId], amount: stars }],
          }),
        }
      )
      const data = await resp.json()

      if (data.ok && data.result && tg) {
        // Open invoice inside Mini App — no context switch
        tg.openInvoice(data.result, (status: string) => {
          if (status === 'paid') {
            router.push('/?payment=success')
          } else if (status === 'cancelled') {
            setProcessingPlan(null)
          }
        })
      } else {
        // Fallback to bot
        const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'clauseIQ_bot'
        window.open(`https://t.me/${botUsername}?start=subscribe_${planId}`, '_blank')
      }
    } catch {
      const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'clauseIQ_bot'
      window.open(`https://t.me/${botUsername}?start=subscribe_${planId}`, '_blank')
    }
  }

  async function handleTonPayment(planId: string, ton: string) {
    const telegramId = user?.id
    if (!telegramId) return

    const memo = `clauseiq_subscribe_${planId}_${telegramId}`
    const tonWallet = process.env.NEXT_PUBLIC_TON_WALLET || ''

    if (!tonWallet) {
      const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'clauseIQ_bot'
      window.open(`https://t.me/${botUsername}?start=ton_${planId}`, '_blank')
      return
    }

    // Open TON wallet deep link — auto-fills address, amount, memo
    const tonLink = `ton://transfer/${tonWallet}?amount=${parseFloat(ton) * 1e9}&text=${encodeURIComponent(memo)}`

    if (tg) {
      tg.openLink(tonLink)
    } else {
      window.open(tonLink, '_blank')
    }

    // Show confirmation instructions
    if (tg) {
      tg.showAlert(
        `Send exactly ${ton} TON to complete your purchase.\n\nMemo: ${memo}\n\nYour access activates automatically within 60 seconds of payment.`
      )
    }
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
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
          Get deeper insights and unlimited contract scanning.
        </div>

        {/* Payment method toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 20,
          gap: 4,
        }}>
          {[
            { id: 'stars', label: '⭐ Telegram Stars', sublabel: 'Instant' },
            { id: 'ton', label: '💎 TON Crypto', sublabel: 'Near-zero fees' },
          ].map(method => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id as 'stars' | 'ton')}
              style={{
                flex: 1,
                padding: '10px 8px',
                borderRadius: 9,
                border: 'none',
                background: paymentMethod === method.id ? 'var(--accent-dim)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                fontSize: 12, fontWeight: 600,
                color: paymentMethod === method.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
              }}>
                {method.label}
              </div>
              <div style={{
                fontSize: 10,
                color: paymentMethod === method.id ? 'var(--accent)' : 'var(--text-muted)',
              }}>
                {method.sublabel}
              </div>
            </button>
          ))}
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
                  color: 'var(--text-primary)', marginBottom: 4,
                }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: plan.stars ? 20 : 18,
                    fontWeight: 700,
                    color: plan.highlight ? 'var(--accent)' : 'var(--text-primary)',
                  }}>
                    {plan.stars
                      ? paymentMethod === 'stars'
                        ? `⭐ ${plan.price}`
                        : `💎 ${plan.ton} TON`
                      : 'Free'}
                  </span>
                  {plan.period && (
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(plan.id, plan.stars, plan.ton)}
                disabled={plan.disabled || processingPlan === plan.id}
                style={{
                  padding: '10px 18px',
                  background: plan.disabled
                    ? 'var(--bg-input)'
                    : plan.highlight
                      ? 'var(--accent)'
                      : 'var(--bg-card)',
                  border: `1px solid ${plan.disabled
                    ? 'var(--border-subtle)'
                    : plan.highlight
                      ? 'var(--accent)'
                      : 'var(--border-medium)'}`,
                  borderRadius: 10,
                  color: plan.disabled
                    ? 'var(--text-muted)'
                    : plan.highlight ? '#000' : 'var(--text-primary)',
                  fontSize: 13, fontWeight: 600,
                  cursor: plan.disabled ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s ease',
                  minWidth: 90,
                  boxShadow: plan.highlight ? '0 4px 12px var(--accent-glow)' : 'none',
                }}
              >
                {processingPlan === plan.id ? '...' : plan.cta}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {plan.features.map(f => (
                <div key={f} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12, color: 'var(--text-secondary)',
                }}>
                  <span style={{
                    color: plan.highlight ? 'var(--accent)' : 'var(--risk-low)',
                    flexShrink: 0,
                  }}>
                    ✓
                  </span>
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
          {paymentMethod === 'stars'
            ? 'Payments processed by Telegram Stars. Cancel anytime.'
            : 'TON payments verified automatically on-chain within 60 seconds.'}
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  )
}