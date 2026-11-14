import { memo } from 'react'
import type { UiCopy } from '../data/translations'

interface CompletionCardProps {
  stats: {
    wpm: number
    cpm: number
    accuracy: number
  }
  copy: UiCopy
  onRestart: () => void
}

function formatStat(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export const CompletionCard = memo(function CompletionCard({
  stats,
  copy,
  onRestart,
}: CompletionCardProps) {
  return (
    <section
      className="completion-card"
      aria-label={copy.completionTitle}
      role="status"
    >
      <h2>{copy.completionTitle}</h2>
      <div className="completion-stats">
        <div className="completion-stat">
          <span>{formatStat(stats.wpm)}</span>
          <span>WPM</span>
        </div>
        <div className="completion-stat">
          <span>{formatStat(stats.cpm)}</span>
          <span>CPM</span>
        </div>
        <div className="completion-stat">
          <span>{stats.accuracy.toFixed(1)}%</span>
          <span>{copy.accuracy}</span>
        </div>
      </div>
      <button type="button" className="completion-restart" onClick={onRestart}>
        {copy.tryAgain}
      </button>
    </section>
  )
})
