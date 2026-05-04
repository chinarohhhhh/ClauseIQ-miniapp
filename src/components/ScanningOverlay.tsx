'use client'
import { useState, useEffect } from 'react'

const SCAN_STEPS = [
  { label: 'Reading document structure...', duration: 800 },
  { label: 'Extracting clauses...', duration: 900 },
  { label: 'Classifying contract type...', duration: 700 },
  { label: 'Analysing liability clauses...', duration: 600 },
  { label: 'Checking IP assignment...', duration: 600 },
  { label: 'Scanning for auto-renewal traps...', duration: 500 },
  { label: 'Scoring risk levels...', duration: 700 },
  { label: 'Generating negotiation moves...', duration: 600 },
  { label: 'Building your report...', duration: 400 },
]

export default function ScanningOverlay() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let stepIndex = 0
    let totalElapsed = 0
    const totalDuration = SCAN_STEPS.reduce((sum, s) => sum + s.duration, 0)

    function runStep() {
      if (stepIndex >= SCAN_STEPS.length) return

      setCurrentStep(stepIndex)
      const step = SCAN_STEPS[stepIndex]
      totalElapsed += step.duration

      const targetProgress = Math.round((totalElapsed / totalDuration) * 100)

      // Animate progress
      const start = progress
      const end = targetProgress
      const duration = step.duration
      const startTime = Date.now()

      const tick = () => {
        const elapsed = Date.now() - startTime
        const p = Math.min(1, elapsed / duration)
        setProgress(Math.round(start + (end - start) * p))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)

      setTimeout(() => {
        setCompletedSteps(prev => [...prev, stepIndex])
        stepIndex++
        runStep()
      }, step.duration)
    }

    runStep()
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24,
      zIndex: 100,
    }}>

      {/* Animated document icon */}
      <div style={{ position: 'relative', marginBottom: 40 }}>
        <div style={{
          width: 80, height: 96,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32,
          position: 'relative',
          overflow: 'hidden',
        }}>
          📄
          {/* Scan line */}
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            animation: 'scanLine 1.8s ease-in-out infinite',
            boxShadow: '0 0 8px var(--accent)',
          }} />
        </div>

        {/* Pulse rings */}
        {[1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            inset: -8 * i,
            borderRadius: 16 + 4 * i,
            border: `1px solid rgba(245, 158, 11, ${0.3 / i})`,
            animation: `pulseRing ${1.5 + i * 0.3}s ease-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20, fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: 6,
        letterSpacing: '-0.02em',
      }}>
        Analysing Contract
      </div>
      <div style={{
        fontSize: 13, color: 'var(--text-secondary)',
        marginBottom: 32, textAlign: 'center', lineHeight: 1.5,
      }}>
        ClauseIQ is scanning every clause<br />for risks and red flags
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%', maxWidth: 280,
        height: 4,
        background: 'var(--bg-card)',
        borderRadius: 4,
        marginBottom: 10,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--accent), #FBBF24)',
          borderRadius: 4,
          transition: 'width 0.1s linear',
          boxShadow: '0 0 8px var(--accent-glow)',
        }} />
      </div>

      <div style={{
        fontSize: 12,
        fontFamily: 'var(--font-mono)',
        color: 'var(--accent)',
        marginBottom: 28,
      }}>
        {progress}% complete
      </div>

      {/* Step list */}
      <div style={{
        width: '100%', maxWidth: 300,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {SCAN_STEPS.slice(0, Math.min(currentStep + 2, SCAN_STEPS.length)).map((step, i) => {
          const isDone = completedSteps.includes(i)
          const isCurrent = i === currentStep

          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                opacity: isDone ? 0.5 : isCurrent ? 1 : 0.3,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{
                width: 16, height: 16, flexShrink: 0,
                borderRadius: '50%',
                background: isDone
                  ? 'var(--risk-low)'
                  : isCurrent
                    ? 'var(--accent)'
                    : 'var(--bg-card)',
                border: `1px solid ${isDone ? 'var(--risk-low)' : isCurrent ? 'var(--accent)' : 'var(--border-medium)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9,
                animation: isCurrent ? 'scanPulse 1s ease infinite' : 'none',
              }}>
                {isDone ? '✓' : isCurrent ? '●' : ''}
              </div>
              <div style={{
                fontSize: 12, color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: isCurrent ? 'var(--font-mono)' : 'var(--font-body)',
              }}>
                {step.label}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes scanLine {
          0% { top: 0; }
          50% { top: calc(100% - 2px); }
          100% { top: 0; }
        }
        @keyframes scanPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
