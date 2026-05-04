export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export const RISK_CONFIG = {
  low: {
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    emoji: '🟢',
    label: 'Low Risk',
    score: 20,
  },
  medium: {
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    emoji: '🟡',
    label: 'Review Recommended',
    score: 55,
  },
  high: {
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    emoji: '🔴',
    label: 'High Risk',
    score: 80,
  },
  critical: {
    color: '#7C3AED',
    bg: 'rgba(124, 58, 237, 0.12)',
    border: 'rgba(124, 58, 237, 0.3)',
    emoji: '⛔',
    label: 'Critical Risk',
    score: 95,
  },
}

export const VERDICT_CONFIG = {
  low_risk: {
    label: 'Safe to Sign',
    sublabel: 'No major issues found',
    icon: '✅',
    color: '#10B981',
  },
  review_recommended: {
    label: 'Negotiate These Points',
    sublabel: 'Review flagged clauses before signing',
    icon: '⚠️',
    color: '#F59E0B',
  },
  high_risk_seek_advice: {
    label: 'Seek Legal Advice',
    sublabel: 'High risk clauses require attention',
    icon: '🚨',
    color: '#EF4444',
  },
}

export function getRiskScore(flags: { risk_level: RiskLevel }[]): number {
  if (!flags || flags.length === 0) return 0
  const weights = { critical: 100, high: 75, medium: 45, low: 15 }
  const total = flags.reduce((sum, f) => sum + (weights[f.risk_level] || 0), 0)
  return Math.min(100, Math.round(total / flags.length))
}

export function formatClauseType(type: string): string {
  return type
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(dateStr)
}
