'use client'
import { useEffect, useState } from 'react'

interface Props {
  score: number
  color: string
  size?: number
}

export default function RiskScoreRing({ score, color, size = 72 }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - 8) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDash = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const duration = 1200
    const start = Date.now()

    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(score * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    const timer = setTimeout(() => requestAnimationFrame(tick), 200)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={4}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDash}
          style={{
            transition: 'stroke-dashoffset 0.05s linear',
            filter: `drop-shadow(0 0 6px ${color}80)`,
          }}
        />
      </svg>
      {/* Score text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: size < 80 ? 16 : 20,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}>
          {animatedScore}
        </div>
        <div style={{
          fontSize: 8,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginTop: 2,
        }}>
          risk
        </div>
      </div>
    </div>
  )
}
