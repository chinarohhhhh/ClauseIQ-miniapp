'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { getReport, type Report, type ClauseFlag } from '../../lib/supabase'
import {
  RISK_CONFIG, VERDICT_CONFIG, getRiskScore,
  formatClauseType, formatDate
} from '../../lib/utils'
import BottomNav from '../../components/BottomNav'
import ClauseCard from '../../components/ClauseCard'
import RiskScoreRing from '../../components/RiskScoreRing'

export default function ResultPage() {
  const router = useRouter()
  const { id } = router.query
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if (id) {
      getReport(id as string)
        .then(r => { setReport(r); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [id])

  if (loading) return <ResultSkeleton />
  if (!report) return <NotFound />

  const flags = report.flags_json || []
  const riskScore = getRiskScore(flags)
  const risk = RISK_CONFIG[report.overall_risk]
  const verdict = VERDICT_CONFIG[report.verdict]
  const visibleFlags = showAll ? flags : flags.slice(0, 5)
  const criticalAndHigh = flags.filter(f => f.risk_level === 'critical' || f.risk_level === 'high')

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky', top: 0,
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: 16,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            fontFamily: 'var(--font-display)',
          }}>
            {report.filename}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            {report.doc_type} · {formatDate(report.created_at)}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {/* Verdict card - TOP SECTION */}
        <div className="animate-scale-in" style={{
          background: risk.bg,
          border: `1px solid ${risk.border}`,
          borderRadius: 20,
          padding: '20px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${risk.color}20, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
            <RiskScoreRing score={riskScore} color={risk.color} />

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: risk.color,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 4,
              }}>
                {risk.emoji} {risk.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18, fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 4,
                lineHeight: 1.2,
              }}>
                {verdict.icon} {verdict.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                {verdict.sublabel}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 12, marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${risk.border}`,
          }}>
            {[
              { label: 'Flags found', value: flags.length },
              { label: 'Critical/High', value: criticalAndHigh.length },
              { label: 'Pages', value: report.page_count || '—' },
            ].map(stat => (
              <div key={stat.label} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20, fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="animate-fade-up delay-1" style={{
          padding: '14px 16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI Summary
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {report.doc_type} agreement with {flags.length} flagged clauses.
            {criticalAndHigh.length > 0
              ? ` ${criticalAndHigh.length} require immediate attention before signing.`
              : ' No critical issues found.'}
          </div>
        </div>

        {/* "What should I do?" decision layer */}
        <DecisionLayer verdict={report.verdict} flags={flags} />

        {/* Clause flags */}
        <div style={{ marginTop: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
            }}>
              Risk Clauses
            </div>
            <span style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: 20,
              background: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
            }}>
              {flags.length} found
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibleFlags.map((flag, i) => (
              <ClauseCard
                key={i}
                flag={flag}
                index={i}
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>

          {flags.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                width: '100%',
                marginTop: 10,
                padding: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: 12,
                color: 'var(--accent)',
                fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              {showAll ? 'Show less' : `View ${flags.length - 5} more clauses`}
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: 24,
          padding: '12px 14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          fontSize: 11,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
        }}>
          ⚖️ This analysis is for informational review only and does not constitute legal advice.
          Always consult a qualified lawyer before signing.
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  )
}

function DecisionLayer({ verdict, flags }: {
  verdict: string
  flags: ClauseFlag[]
}) {
  const highFlags = flags.filter(f => f.risk_level === 'critical' || f.risk_level === 'high')

  if (verdict === 'low_risk') {
    return (
      <div className="animate-fade-up delay-2" style={{
        padding: '14px 16px',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 12,
        marginBottom: 4,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#10B981', marginBottom: 4 }}>
          ✅ Safe to sign
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          No major red flags detected. Review the flagged clauses below for completeness.
        </div>
      </div>
    )
  }

  if (verdict === 'high_risk_seek_advice') {
    return (
      <div className="animate-fade-up delay-2" style={{
        padding: '14px 16px',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 12,
        marginBottom: 4,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', marginBottom: 6 }}>
          🚨 Seek legal advice before signing
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          This contract contains high-risk clauses that could expose you to significant liability.
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up delay-2" style={{
      padding: '14px 16px',
      background: 'rgba(245, 158, 11, 0.08)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
      borderRadius: 12,
      marginBottom: 4,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 6 }}>
        ⚠️ Negotiate {highFlags.length} point{highFlags.length !== 1 ? 's' : ''} before signing
      </div>
      {highFlags.slice(0, 3).map((f, i) => (
        <div key={i} style={{
          fontSize: 12, color: 'var(--text-secondary)',
          display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 4,
        }}>
          <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
          {formatClauseType(f.clause_type)}
        </div>
      ))}
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', padding: 20 }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="shimmer" style={{
          height: i === 1 ? 120 : 80,
          borderRadius: 16,
          marginBottom: 12,
        }} />
      ))}
    </div>
  )
}

function NotFound() {
  const router = useRouter()
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: 20, textAlign: 'center',
    }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        Report not found
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
        This scan may have expired or been deleted.
      </div>
      <button
        onClick={() => router.push('/')}
        style={{
          padding: '10px 24px',
          background: 'var(--accent)',
          color: '#000', fontWeight: 600,
          border: 'none', borderRadius: 10,
          cursor: 'pointer', fontSize: 14,
        }}
      >
        Back to Home
      </button>
    </div>
  )
}
