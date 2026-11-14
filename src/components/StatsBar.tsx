import { memo, useEffect, useRef, useState } from 'react'
import type { UiCopy } from '../data/translations'

interface StatsBarProps {
  copy: UiCopy
  stats: {
    wpm: number
    cpm: number
    accuracy: number
  }
}

function formatStat(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function formatAccuracy(value: number): string {
  return `${value.toFixed(1)}%`
}

interface AnimatedValueProps {
  value: number
  format: (value: number) => string
}

const AnimatedValue = memo(function AnimatedValue({
  value,
  format,
}: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const currentValueRef = useRef(value)

  useEffect(() => {
    const startValue = currentValueRef.current

    if (value === startValue) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      currentValueRef.current = value
      setDisplayValue(value)
      return
    }

    const startedAt = performance.now()
    const duration = 220
    let frameId = 0

    function updateValue(now: number): void {
      const progress = Math.min((now - startedAt) / duration, 1)
      const easedProgress = 1 - (1 - progress) ** 3
      const nextValue = startValue + (value - startValue) * easedProgress

      currentValueRef.current = nextValue
      setDisplayValue(progress === 1 ? value : nextValue)

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateValue)
      }
    }

    frameId = window.requestAnimationFrame(updateValue)

    return () => window.cancelAnimationFrame(frameId)
  }, [value])

  return <span className="stat-value">{format(displayValue)}</span>
})

export const StatsBar = memo(function StatsBar({ stats, copy }: StatsBarProps) {
  return (
    <div className="stats-bar" aria-label={copy.typingStatistics}>
      <div className="stat-item">
        <AnimatedValue value={stats.wpm} format={formatStat} />
        <span className="stat-label">WPM</span>
      </div>
      <div className="stat-item">
        <AnimatedValue value={stats.cpm} format={formatStat} />
        <span className="stat-label">CPM</span>
      </div>
      <div className="stat-item">
        <AnimatedValue value={stats.accuracy} format={formatAccuracy} />
        <span className="stat-label">{copy.accuracy}</span>
      </div>
    </div>
  )
})
