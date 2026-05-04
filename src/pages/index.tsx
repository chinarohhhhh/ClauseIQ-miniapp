'use client'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDropzone } from 'react-dropzone'
import { useTelegram } from '../hooks/useTelegram'
import { getUserReports, type Report } from '../lib/supabase'
import { RISK_CONFIG, timeAgo } from '../lib/utils'
import BottomNav from '../components/BottomNav'
import ScanningOverlay from '../components/ScanningOverlay'

export default function Home() {
  const router = useRouter()
  const { user, isReady } = useTelegram()
  const [reports, setReports] = useState<Report[]>([])
  const [scanning, setScanning] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (user?.id) {
      getUserReports(user.id).then(setReports).catch(console.error)
    }
  }, [user])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.jpg', '.jpeg', '.png'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  function handleFileUpload(file: File) {
    // In production this calls your Python backend API
    // For now shows the scanning animation then redirects to demo result
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      if (reports.length > 0) {
        router.push(`/result/${reports[0].id}`)
      }
    }, 4000)
  }

  if (!isReady) return <LoadingScreen />
  if (scanning) return <ScanningOverlay />

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>
              Clause<span className="text-gradient">IQ</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {user ? `Hey, ${user.first_name}` : 'Contract Risk Intelligence'}
            </div>
          </div>
          <div style={{
            width: 38, height: 38,
            borderRadius: '50%',
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            ⚖️
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <div style={{ padding: '0 20px' }}>
        <div
          {...getRootProps()}
          style={{
            background: isDragActive
              ? 'rgba(245, 158, 11, 0.08)'
              : 'var(--bg-card)',
            border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border-medium)'}`,
            borderRadius: 20,
            padding: '32px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <input {...getInputProps()} />

          {/* Ambient glow when dragging */}
          {isDragActive && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          )}

          <div style={{
            width: 64, height: 64,
            background: 'var(--accent-dim)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28,
            border: '1px solid var(--accent-glow)',
          }}>
            {isDragActive ? '📂' : '📄'}
          </div>

          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 6,
          }}>
            {isDragActive ? 'Drop to analyse' : 'Upload Your Contract'}
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            Drag & drop or tap to select<br />
            PDF, JPG, PNG up to 10MB
          </div>

          {/* Format chips */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['PDF', 'JPG', 'PNG', 'Scanned'].map(fmt => (
              <span key={fmt} style={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                padding: '3px 10px',
                borderRadius: 20,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}>
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 12,
          padding: '10px 14px',
          background: 'var(--bg-card)',
          borderRadius: 12,
          border: '1px solid var(--border-subtle)',
        }}>
          {[
            { icon: '🔒', text: 'Private & encrypted' },
            { icon: '⚡', text: 'Results in ~15s' },
            { icon: '🗑️', text: 'Auto-deleted after scan' },
          ].map(badge => (
            <div key={badge.text} style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1 }}>
              <span style={{ fontSize: 12 }}>{badge.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Scans */}
      {reports.length > 0 && (
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15, fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              Recent Scans
            </div>
            <button
              onClick={() => router.push('/history')}
              style={{
                fontSize: 12, color: 'var(--accent)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              View all →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reports.slice(0, 3).map((report, i) => (
              <RecentScanCard
                key={report.id}
                report={report}
                onClick={() => router.push(`/result/${report.id}`)}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {reports.length === 0 && isReady && (
        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            No scans yet.<br />Upload your first contract above.
          </div>
        </div>
      )}

      <div style={{ height: 80 }} />
      <BottomNav active="home" />
    </div>
  )
}

function RecentScanCard({
  report,
  onClick,
  style,
}: {
  report: Report
  onClick: () => void
  style?: React.CSSProperties
}) {
  const risk = RISK_CONFIG[report.overall_risk]

  return (
    <button
      onClick={onClick}
      className="animate-fade-up"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      <div style={{
        width: 40, height: 40,
        borderRadius: 10,
        background: risk.bg,
        border: `1px solid ${risk.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>
        {risk.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {report.filename}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
          {report.doc_type} · {timeAgo(report.created_at)}
        </div>
      </div>
      <div style={{
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        color: risk.color,
        fontWeight: 500,
        flexShrink: 0,
      }}>
        {risk.label}
      </div>
    </button>
  )
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24, fontWeight: 700,
          marginBottom: 8,
        }}>
          Clause<span className="text-gradient">IQ</span>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading...</div>
      </div>
    </div>
  )
}
