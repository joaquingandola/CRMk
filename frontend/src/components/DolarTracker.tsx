import { useState, useEffect, useCallback } from 'react'

const REFRESH_INTERVAL = 60_000

// ── Types ────────────────────────────────────────────────────────────────────

interface RatesData {
  compra: number
  venta: number
}

interface DolarState {
  blue: RatesData | null
  ccl: RatesData | null
}

interface TickerProps {
  label: string
  compra: number | undefined
  venta: number | undefined
  spread: number | null
  color: string
  icon: string
  loading: boolean
}

interface CountdownRingProps {
  seconds: number
  total: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatPrice = (value: number | undefined): string =>
  value != null
    ? new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
      }).format(value)
    : '—'

// ── Sub-components ────────────────────────────────────────────────────────────

const Ticker = ({ label, compra, venta, spread, color, icon, loading }: TickerProps) => {
  return (
    <div
      style={{
        background: '#0f0f13',
        border: `1px solid ${color}22`,
        borderRadius: '16px',
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden',
        flex: 1,
        minWidth: '260px',
      }}
    >
      {/* Glow top line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          borderRadius: '999px',
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '22px' }}>{icon}</span>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color,
          }}
        >
          {label}
        </span>
      </div>

      {/* Prices */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: '28px',
                borderRadius: '6px',
                background: '#1e1e26',
                animation: 'pulse 1.4s ease-in-out infinite',
                width: i === 1 ? '60%' : '50%',
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '12px', color: '#555', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.06em' }}>
              COMPRA
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: '26px',
                color: '#e8e8f0',
                letterSpacing: '-0.02em',
              }}
            >
              {formatPrice(compra)}
            </span>
          </div>
          <div style={{ height: '1px', background: '#1e1e26' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '12px', color: '#555', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.06em' }}>
              VENTA
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '32px',
                color: '#fff',
                letterSpacing: '-0.03em',
              }}
            >
              {formatPrice(venta)}
            </span>
          </div>
        </div>
      )}

      {/* Spread badge */}
      {!loading && spread != null && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: `${color}14`,
            border: `1px solid ${color}33`,
            borderRadius: '6px',
            padding: '4px 10px',
            alignSelf: 'flex-start',
          }}
        >
          <span style={{ fontSize: '10px', color: '#555', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em' }}>
            DIFERENCIA
          </span>
          <span style={{ fontSize: '13px', color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
            {formatPrice(spread)}
          </span>
        </div>
      )}
    </div>
  )
}

const CountdownRing = ({ seconds, total }: CountdownRingProps) => {
  const radius = 14
  const circumference = 2 * Math.PI * radius
  const progress = (seconds / total) * circumference

  return (
    <svg width="36" height="36" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="18" cy="18" r={radius} fill="none" stroke="#1e1e26" strokeWidth="2.5" />
      <circle
        cx="18"
        cy="18"
        r={radius}
        fill="none"
        stroke="#3d8ef0"
        strokeWidth="2.5"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DolarTracker() {
  const [data, setData] = useState<DolarState>({ blue: null, ccl: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(60)

  const fetchRates = useCallback(async () => {
    setError(null)
    try {
      const [blueRes, cclRes] = await Promise.all([
        fetch('https://dolarapi.com/v1/dolares/blue'),
        fetch('https://dolarapi.com/v1/dolares/contadoconliqui'),
      ])

      if (!blueRes.ok || !cclRes.ok) throw new Error('Error al obtener cotizaciones')

      const [blue, ccl]: [RatesData, RatesData] = await Promise.all([
        blueRes.json(),
        cclRes.json(),
      ])

      setData({ blue, ccl })
      setLastUpdate(new Date())
      setCountdown(60)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchRates])

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 60))
    }, 1000)
    return () => clearInterval(tick)
  }, [lastUpdate])

  const blueSpread =
    data.blue?.venta != null && data.blue?.compra != null
      ? data.blue.venta - data.blue.compra
      : null

  const cclSpread =
    data.ccl?.venta != null && data.ccl?.compra != null
      ? data.ccl.venta - data.ccl.compra
      : null

  return (
    <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '16px 0',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '0.18em', color: '#3d5a80', textTransform: 'uppercase', marginBottom: '4px' }}>
              Cotización · Argentina
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#e8e8f0', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
              Dólar <span style={{ color: '#3d8ef0' }}>USD</span>
            </h2>
          </div>

          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={fetchRates}
            title="Actualizar ahora"
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#3a3a4e', letterSpacing: '0.06em' }}>PRÓXIMA ACTUALIZACIÓN</div>
              <div style={{ fontSize: '14px', color: '#4a4a6a', fontWeight: 600 }}>{countdown}s</div>
            </div>
            <CountdownRing seconds={countdown} total={60} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: '#1a0a0a',
              border: '1px solid #ff4d4d33',
              borderRadius: '10px',
              padding: '14px 18px',
              color: '#ff6b6b',
              fontSize: '13px',
            }}
          >
            ⚠ {error} —{' '}
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer', color: '#3d8ef0' }}
              onClick={fetchRates}
            >
              Reintentar
            </span>
          </div>
        )}

        {/* Cards */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Ticker label="Blue" icon="💵" compra={data.blue?.compra} venta={data.blue?.venta} spread={blueSpread} color="#3d8ef0" loading={loading} />
          <Ticker label="CCL" icon="📊" compra={data.ccl?.compra} venta={data.ccl?.venta} spread={cclSpread} color="#a78bfa" loading={loading} />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #13131a', paddingTop: '14px' }}>
          <span style={{ fontSize: '11px', color: '#64648a', letterSpacing: '0.06em' }}>Fuente: dolarapi.com</span>
          {lastUpdate && (
            <span style={{ fontSize: '11px', color: '#64648a' }}>
              Última actualización:{' '}
              {lastUpdate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
