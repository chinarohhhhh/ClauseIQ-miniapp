'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTelegram } from '../hooks/useTelegram'
import { getUserReports, type Report } from '../lib/supabase'
import { RISK_CONFIG, VERDICT_CONFIG, timeAgo } from '../lib/utils'
import BottomNav from '../components/BottomNav'

export default function HistoryPage() {
  const router = useRouter()
  const { user } = useTelegram()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (user?.id) {
      getUserReports(user.id)
        .then(r => { setReports(r); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [user])

  const filtered = filter === 'all'
    ? reports
    : reports.filter(r => r.overall_risk === filter)

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: 4,
        }}>
          Contract Vault
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          {reports.length} contract{reports.length !== 1 ? 's' : ''} analysed
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'critical', label: '⛔ Critical' },
            { value: 'high', label: '🔴 High' },
            { value: 'medium', label: '🟡 Medium' },
            { value: 'low', label: '🟢 Low' },
          ].map(chip => (
            <button
              key={chip.value}
              onClick={() => setFilter(chip.value)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12, fontWeight: 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                border: `1px solid ${filter === chip.value ? 'var(--accent)' : 'var(--border-subtle)'}`,
                background: filter === chip.value ? 'var(--accent-dim)' : 'var(--bg-card)',
                color: filter === chip.value ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s ease',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '16px 20px 0' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="shimmer" style={{ height: 76, borderRadius: 14 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} onReset={() => setFilter('all')} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((report, i) => (
              <HistoryCard
                key={report.id}
                report={report}
                index={i}
                onClick={() => router.push(`/result/${report.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav active="history" />
    </div>
  )
}

function HistoryCard({ report, index, onClick }: {
  report: Report
  index: number
  onClick: () => void
}) {
  const risk = RISK_CONFIG[report.overall_risk]
  const verdict = VERDICT_CONFIG[report.verdict]

  return (
    <button
      onClick={onClick}
      className="animate-fade-up"
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 14,
        cursor: 'pointer',
        width: '100%', textAlign: 'left',
        transition: 'all 0.2s ease',
        animationDelay: `${index * 0.04}s`,
        opacity: 0,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: risk.bg,
        border: `1px solid ${risk.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>
        {risk.emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 2,
        }}>
          {report.filename}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: 'var(--text-secondary)',
        }}>
          <span>{report.doc_type}</span>
          <span>·</span>
          <span>{(report.flags_json || []).length} flags</span>
          <span>·</span>
          <span>{timeAgo(report.created_at)}</span>
        </div>
      </div>

      {/* Verdict */}
      <div style={{
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: risk.color,
        textAlign: 'right',
        flexShrink: 0,
        maxWidth: 72,
        lineHeight: 1.3,
      }}>
        {verdict.icon}<br />{risk.label}
      </div>
    </button>
  )
}

function EmptyState({ filter, onReset }: { filter: string; onReset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>
        {filter === 'all' ? '📂' : '🔍'}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
        {filter === 'all' ? 'No contracts yet' : `No ${filter} risk contracts`}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        {filter === 'all'
          ? 'Upload your first contract to get started'
          : 'Try a different filter'}
      </div>
      {filter !== 'all' && (
        <button
          onClick={onReset}
          style={{
            padding: '8px 20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 8, cursor: 'pointer',
            fontSize: 13, color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Show all
        </button>
      )}
    </div>
  )
}
