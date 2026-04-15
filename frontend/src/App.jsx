import { useState, useRef } from 'react'

/* ── Orb decorations behind the card ───────────────────────────── */
function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {/* Large violet orb — top-left */}
      <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-violet-600/40 blur-[120px] animate-float" />
      {/* Cyan orb — bottom-right */}
      <div
        className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full bg-cyan-400/30 blur-[100px] animate-float"
        style={{ animationDelay: '1.5s' }}
      />
      {/* Pink accent — top-right */}
      <div
        className="absolute top-1/4 right-8 w-[260px] h-[260px] rounded-full bg-fuchsia-500/25 blur-[90px] animate-float"
        style={{ animationDelay: '3s' }}
      />
    </div>
  )
}

/* ── Animated traffic-score bar ─────────────────────────────────── */
function ScoreBar({ score }) {
  const pct = Math.round(score * 100)
  const isHigh = score >= 0.7
  const barColor = isHigh
    ? 'from-orange-400 to-red-500'
    : 'from-emerald-400 to-teal-400'

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-xs text-white/60 mb-1 font-medium">
        <span>Traffic Score</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-white/40 mt-1">
        <span>Low congestion</span>
        <span>High congestion</span>
      </div>
    </div>
  )
}

/* ── Result badge (GO / WAIT) ───────────────────────────────────── */
function ResultBadge({ decision, destination, score }) {
  const isGo = decision === 'GO'

  return (
    <div className="animate-fade-in-up mt-6 flex flex-col items-center gap-3">
      {/* Main decision pill */}
      <div
        className={`
          relative flex items-center justify-center
          w-44 h-44 rounded-full font-black text-6xl tracking-tight select-none
          shadow-2xl transition-all duration-500
          ${isGo
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-500/40 animate-pulse-glow'
            : 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-orange-500/40 animate-pulse-glow'
          }
        `}
        role="status"
        aria-label={`Decision: ${decision}`}
      >
        {isGo ? '🚀' : '⏳'}
        <span className="absolute bottom-10 text-2xl font-black tracking-widest">
          {decision}
        </span>
      </div>

      {/* Sub-label */}
      <p className="text-white/80 text-sm font-medium text-center max-w-xs">
        {isGo
          ? `✅ Clear path to ${destination}. Hit the road!`
          : `🚦 High congestion ahead to ${destination}. Consider waiting.`}
      </p>

      {/* Score bar */}
      <div className="w-full max-w-sm">
        <ScoreBar score={score} />
      </div>
    </div>
  )
}

/* ── Spinner ────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}

/* ── Main App ───────────────────────────────────────────────────── */
export default function App() {
  const [destination, setDestination] = useState('')
  const [result, setResult]           = useState(null)   // { decision, traffic_score, destination }
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const inputRef = useRef(null)

  async function handleCheck(e) {
    e.preventDefault()
    const dest = destination.trim()
    if (!dest) {
      inputRef.current?.focus()
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(
        `/api/v1/predictions/recommend?destination=${encodeURIComponent(dest)}`
      )
      if (!res.ok) throw new Error(`Server responded with ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setDestination('')
    setResult(null)
    setError(null)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#1a1040] to-[#24243e] px-4 py-12 overflow-hidden">
      <BackgroundOrbs />

      {/* ── Glass Card ─────────────────────────────────────────────── */}
      <div className="glass-card relative z-10 w-full max-w-md p-8 sm:p-10 flex flex-col items-center gap-6">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-semibold text-violet-300 tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Urban Mobility Hackathon
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Predictive{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Commute Pro
            </span>
          </h1>
          <p className="mt-2 text-white/50 text-sm font-medium">
            Real-time AI commute intelligence at your fingertips.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Form */}
        <form id="commute-form" onSubmit={handleCheck} className="w-full flex flex-col gap-4">
          <div className="relative">
            {/* Map pin icon */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 text-lg pointer-events-none select-none">
              📍
            </span>
            <input
              id="destination-input"
              ref={inputRef}
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter your destination…"
              autoComplete="off"
              spellCheck="false"
              aria-label="Destination"
              className="
                w-full pl-12 pr-4 py-4 rounded-2xl
                bg-white/10 border border-white/20
                text-white placeholder-white/30 text-base font-medium
                focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-400/50
                transition-all duration-200
              "
            />
          </div>

          {/* CTA Button */}
          <button
            id="check-commute-btn"
            type="submit"
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              w-full py-4 rounded-full
              bg-gradient-to-r from-violet-600 to-cyan-500
              hover:from-violet-500 hover:to-cyan-400
              active:scale-95
              text-white font-bold text-base tracking-wide
              shadow-lg shadow-violet-500/30
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <Spinner />
                Analysing traffic…
              </>
            ) : (
              <>
                <span>🛰️</span> Check Commute
              </>
            )}
          </button>
        </form>

        {/* Error state */}
        {error && (
          <div
            id="error-message"
            role="alert"
            className="w-full animate-fade-in-up bg-red-500/20 border border-red-400/30 rounded-2xl px-4 py-3 text-red-300 text-sm text-center"
          >
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <ResultBadge
            decision={result.decision}
            destination={result.destination}
            score={result.traffic_score}
          />
        )}

        {/* Reset link */}
        {result && (
          <button
            id="reset-btn"
            type="button"
            onClick={handleReset}
            className="text-white/40 hover:text-white/70 text-xs font-medium transition-colors duration-200 underline underline-offset-4"
          >
            Check another destination
          </button>
        )}

        {/* Footer */}
        <p className="text-white/20 text-[11px] text-center mt-2 font-medium">
          Powered by FastAPI · React · Urban Mobility AI
        </p>
      </div>
    </main>
  )
}
