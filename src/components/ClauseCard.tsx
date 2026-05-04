'use client'
import { useState } from 'react'
import { type ClauseFlag } from '../lib/supabase'
import { RISK_CONFIG, formatClauseType } from '../lib/utils'

interface Props {
  flag: ClauseFlag
  index: number
  style?: React.CSSProperties
}

export default function ClauseCard({ flag, index, style }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const risk = RISK_CONFIG[flag.risk_level]

  function copyNegotiation() {
    navigator.clipboard.writeText(flag.negotiation_move)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const confidenceBars = Math.round(flag.confidence / 20)

  return (
    <div
      className="animate-fade-up"
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${expanded ? risk.border : 'var(--border-subtle)'}`,
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        ...style,
      }}
    >
      {/* Card header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          padding: '14px 14px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Risk indicator */}
        <div style={{
          width: 36, height: 36,
          borderRadius: 9,
          background: risk.bg,
          border: `1px solid ${risk.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
        }}>
          {risk.emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Clause type + risk badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 13, fontWeight: 600,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
            }}>
              {formatClauseType(flag.clause_type)}
            </span>
            <span className="risk-badge" style={{
              color: risk.color,
              background: risk.bg,
              border: `1px solid ${risk.border}`,
            }}>
              {flag.risk_level}
            </span>
          </div>

          {/* Plain summary */}
          <div style={{
            fontSize: 12, color: 'var(--text-secondary)',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
            overflow: expanded ? 'visible' : 'hidden',
          }}>
            {flag.plain_summary}
          </div>

          {/* Confidence + page ref */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginTop: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: 2,
                  background: i <= confidenceBars ? risk.color : 'var(--border-medium)',
                  transition: 'background 0.2s',
                }} />
              ))}
              <span style={{
                fontSize: 10, color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', marginLeft: 4,
              }}>
                {flag.confidence}%
              </span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>·</span>
            <span style={{
              fontSize: 10, color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              {flag.page_reference}
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        <div style={{
          fontSize: 12, color: 'var(--text-muted)', flexShrink: 0,
          transition: 'transform 0.2s',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          marginTop: 2,
        }}>
          ▾
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{
          padding: '0 14px 14px',
          borderTop: `1px solid ${risk.border}`,
          paddingTop: 14,
          animation: 'fadeUp 0.2s ease-out',
        }}>

          {/* Why this matters */}
          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 5,
            }}>
              Why this matters
            </div>
            <div style={{
              fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              {flag.plain_summary}
            </div>
          </div>

          {/* Original language */}
          {flag.original_language && (
            <div style={{
              padding: '10px 12px',
              background: 'var(--bg-input)',
              borderRadius: 8,
              marginBottom: 12,
              borderLeft: `3px solid ${risk.color}`,
            }}>
              <div style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Contract text
              </div>
              <div style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}>
                "{flag.original_language}"
              </div>
            </div>
          )}

          {/* Negotiation move */}
          <div style={{
            padding: '12px 12px',
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            borderRadius: 10,
          }}>
            <div style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 6,
            }}>
              📌 What to negotiate
            </div>
            <div style={{
              fontSize: 12, color: 'var(--text-primary)',
              lineHeight: 1.6, marginBottom: 10,
            }}>
              {flag.negotiation_move}
            </div>

            {/* Copy button */}
            <button
              onClick={copyNegotiation}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px',
                background: copied ? 'rgba(16,185,129,0.15)' : 'var(--bg-card)',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border-medium)'}`,
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 11, fontWeight: 500,
                color: copied ? '#10B981' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{copied ? '✓' : '📋'}</span>
              {copied ? 'Copied!' : 'Copy negotiation message'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
