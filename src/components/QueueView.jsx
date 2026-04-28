import React, { useState } from 'react'
import { format, addDays, startOfDay } from 'date-fns'
import { getProblemStatus, getUpcomingRevisions } from '../lib/storage'
import { ProblemCard } from './ProblemCard'
import styles from './QueueView.module.css'

const FILTERS = [
  { key: 'all', label: 'All Active' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'due-today', label: 'Due Today' },
  { key: 'upcoming', label: 'Upcoming' },
]

export function QueueView({ problems, onMarkDone, onViewDetail }) {
  const [filter, setFilter] = useState('all')

  const activeProblemsSorted = problems
    .filter(p => getProblemStatus(p) !== 'completed')
    .filter(p => filter === 'all' || getProblemStatus(p) === filter)
    .sort((a, b) => {
      const order = { 'overdue': 0, 'due-today': 1, 'upcoming': 2 }
      return order[getProblemStatus(a)] - order[getProblemStatus(b)]
    })

  const upcomingMap = getUpcomingRevisions(problems, 14)
  const today = startOfDay(new Date()).getTime()

  const calDays = Array.from({ length: 14 }, (_, i) => {
    const ts = addDays(today, i).getTime()
    return { ts, items: upcomingMap[ts] || [], label: format(ts, 'EEE'), date: format(ts, 'd'), month: format(ts, 'MMM') }
  })

  const counts = {
    overdue: problems.filter(p => getProblemStatus(p) === 'overdue').length,
    'due-today': problems.filter(p => getProblemStatus(p) === 'due-today').length,
    upcoming: problems.filter(p => getProblemStatus(p) === 'upcoming').length,
  }

  return (
    <div className={styles.wrap}>
      {/* Calendar strip */}
      <div className={styles.calSection}>
        <div className={styles.calLabel}>// next 14 days</div>
        <div className={styles.calStrip}>
          {calDays.map(({ ts, items, label, date, month }, i) => (
            <div
              key={ts}
              className={`${styles.calDay} ${i === 0 ? styles.calToday : ''} ${items.length > 0 ? styles.calHasDue : ''}`}
            >
              <span className={styles.calDayName}>{label}</span>
              <span className={styles.calDate}>{date}</span>
              {items.length > 0 && <span className={styles.calCount}>{items.length}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== 'all' && counts[f.key] > 0 && (
              <span className={`${styles.filterCount} ${f.key === 'overdue' ? styles.countRed : f.key === 'due-today' ? styles.countAmber : styles.countCyan}`}>
                {counts[f.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Problem list */}
      {activeProblemsSorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-pixel">
            <svg width="64" height="64" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
              <rect x="4" y="0" width="8" height="2" fill="var(--border-strong)" />
              <rect x="2" y="2" width="2" height="2" fill="var(--border-strong)" />
              <rect x="12" y="2" width="2" height="2" fill="var(--border-strong)" />
              <rect x="0" y="4" width="16" height="8" fill="var(--border-strong)" />
              <rect x="2" y="12" width="2" height="2" fill="var(--border-strong)" />
              <rect x="12" y="12" width="2" height="2" fill="var(--border-strong)" />
              <rect x="4" y="14" width="8" height="2" fill="var(--border-strong)" />
              <rect x="4" y="6" width="2" height="2" fill="var(--bg2)" />
              <rect x="10" y="6" width="2" height="2" fill="var(--bg2)" />
              <rect x="4" y="10" width="8" height="2" fill="var(--bg2)" />
            </svg>
          </div>
          <p>
            {filter === 'all'
              ? 'No active problems yet.\nLog your first problem to get started!'
              : `No problems with "${FILTERS.find(f => f.key === filter)?.label}" status.`
            }
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {activeProblemsSorted.map((p, i) => (
            <ProblemCard
              key={p.id}
              problem={p}
              onMarkDone={onMarkDone}
              onViewDetail={onViewDetail}
              animate
              animIndex={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
