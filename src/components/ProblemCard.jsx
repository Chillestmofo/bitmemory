import React from 'react'
import { ExternalLink, CheckCircle, Clock, AlertTriangle, Image } from 'lucide-react'
import { getNextRevision, isRevisionOverdue, isRevisionToday, getProblemStatus, formatDate, REVISION_INTERVALS } from '../lib/storage'
import { format, addDays } from 'date-fns'
import styles from './ProblemCard.module.css'

const STATUS_CONFIG = {
  'overdue':   { label: 'OVERDUE', cls: styles.statusOverdue, icon: AlertTriangle },
  'due-today': { label: 'DUE TODAY', cls: styles.statusToday, icon: Clock },
  'upcoming':  { label: 'UPCOMING', cls: styles.statusUpcoming, icon: Clock },
  'completed': { label: 'COMPLETE', cls: styles.statusDone, icon: CheckCircle },
}

export function ProblemCard({ problem, onMarkDone, onViewDetail, animate = false, animIndex = 0 }) {
  const next = getNextRevision(problem)
  const status = getProblemStatus(problem)
  const cfg = STATUS_CONFIG[status]
  const StatusIcon = cfg.icon

  const nextRevIdx = next ? problem.revisions.findIndex(r => r.day === next.day) : -1

  const getDueText = () => {
    if (!next) return 'All revisions complete!'
    if (isRevisionOverdue(next)) {
      const d = Math.round((Date.now() - next.dueAt) / 86400000)
      return `${d}d overdue — do it now!`
    }
    if (isRevisionToday(next)) return 'Scheduled for today!'
    return `Next revision: ${format(next.dueAt, 'MMM d, yyyy')}`
  }

  return (
    <div
      className={`${styles.card} ${styles[`card_${status.replace('-','_')}`]} ${animate ? 'fade-up' : ''}`}
      style={animate ? { animationDelay: `${animIndex * 0.05}s` } : {}}
    >
      {/* Status bar */}
      <div className={`${styles.statusBar} ${cfg.cls}`}>
        <StatusIcon size={10} />
        <span>{cfg.label}</span>
        {next && <span className={styles.statusRight}>{getDueText()}</span>}
      </div>

      <div className={styles.body}>
        {/* Title row */}
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{problem.name}</h3>
          <div className={styles.badges}>
            <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </span>
            <span className={styles.platform}>{problem.platform}</span>
          </div>
        </div>

        {/* Tags */}
        {problem.tags.length > 0 && (
          <div className={styles.tags}>
            {problem.tags.slice(0, 5).map(t => (
              <span key={t} className={styles.tagChip}>{t}</span>
            ))}
            {problem.tags.length > 5 && <span className={styles.tagMore}>+{problem.tags.length - 5}</span>}
          </div>
        )}

        {/* Progress track */}
        <div className={styles.progress}>
          {REVISION_INTERVALS.map((d, i) => {
            const rev = problem.revisions[i]
            const isNext = next && next.day === d && !rev.done
            return (
              <React.Fragment key={d}>
                <div className={`${styles.progNode} ${rev.done ? styles.progDone : isNext ? styles.progNext : styles.progPending}`}>
                  <div className={styles.progDot} />
                  <span className={styles.progLabel}>D{d}</span>
                </div>
                {i < REVISION_INTERVALS.length - 1 && (
                  <div className={`${styles.progLine} ${rev.done ? styles.progLineDone : ''}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            {problem.link && (
              <a href={problem.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <ExternalLink size={12} />
                Open Problem
              </a>
            )}
            {problem.images?.length > 0 && (
              <span className={styles.imgCount}>
                <Image size={12} />
                {problem.images.length} screenshot{problem.images.length > 1 ? 's' : ''}
              </span>
            )}
            <span className={styles.addedDate}>Added {formatDate(problem.addedAt)}</span>
          </div>
          <div className={styles.footerRight}>
            <button className="btn-secondary" onClick={() => onViewDetail(problem)}>
              Details
            </button>
            {next && (isRevisionOverdue(next) || isRevisionToday(next)) && (
              <button className="btn-primary" onClick={() => onMarkDone(problem.id, nextRevIdx)}>
                Mark Done ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
