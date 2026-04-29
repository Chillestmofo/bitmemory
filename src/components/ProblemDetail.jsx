import React, { useState } from 'react'
import { X, ExternalLink, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { REVISION_INTERVALS, formatDate, isRevisionOverdue, isRevisionToday, getNextRevision } from '../lib/storage'
import { format } from 'date-fns'
import styles from './ProblemDetail.module.css'

export function ProblemDetail({ problem, onClose, onMarkDone, onDelete }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const next = getNextRevision(problem)
  const nextRevIdx = next ? problem.revisions.findIndex(r => r.day === next.day) : -1

  const canMarkDone = next && (isRevisionOverdue(next) || isRevisionToday(next))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <span className="modal-title">// problem detail</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="modal-body">
          {/* Header */}
          <div className={styles.head}>
            <div className={styles.headLeft}>
              <h2 className={styles.name}>{problem.name}</h2>
              <div className={styles.headMeta}>
                <span className={`diff-badge diff-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
                <span className={styles.platform}>{problem.platform}</span>
                <span className={styles.date}>Added {formatDate(problem.addedAt)}</span>
              </div>
              {problem.link && (
                <a href={problem.link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  <ExternalLink size={13} /> Open on {problem.platform}
                </a>
              )}
            </div>
            {canMarkDone && (
              <button className="btn-primary" onClick={() => { onMarkDone(problem.id, nextRevIdx); onClose(); }}>
                Mark Day {next.day} Done ✓
              </button>
            )}
          </div>

          {/* Tags */}
          {problem.tags.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>// patterns</div>
              <div className={styles.tagRow}>
                {problem.tags.map(t => (
                  <span key={t} className="tag selected" style={{ cursor: 'default' }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Revision Schedule */}
          {!problem.isSavedOnly && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>// revision schedule</div>
              <div className={styles.revTable}>
                {REVISION_INTERVALS.map((d, i) => {
                  const rev = problem.revisions[i]
                  const isNext = next && next.day === d
                  return (
                    <div key={d} className={`${styles.revRow} ${isNext ? styles.revRowNext : ''} ${rev.done ? styles.revRowDone : ''}`}>
                      <div className={styles.revDay}>
                        <span className={styles.revDayLabel}>Day {d}</span>
                      </div>
                      <div className={styles.revDate}>{format(rev.dueAt, 'MMM d, yyyy')}</div>
                      <div className={styles.revStatus}>
                        {rev.done ? (
                          <span className={styles.statusDone}>✓ Done — {rev.completedAt ? format(rev.completedAt, 'MMM d') : ''}</span>
                        ) : isRevisionOverdue(rev) ? (
                          <span className={styles.statusOverdue}>⚠ Overdue</span>
                        ) : isRevisionToday(rev) ? (
                          <span className={styles.statusToday}>● Due today</span>
                        ) : (
                          <span className={styles.statusPending}>○ Pending</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {problem.notes && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>// your approach</div>
              <div className={styles.notes}>{problem.notes}</div>
            </div>
          )}

          {/* Screenshots */}
          {problem.images?.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>// screenshots ({problem.images.length})</div>
              <div className={styles.imgViewer}>
                <img src={problem.images[imgIdx]} alt={`screenshot ${imgIdx + 1}`} className={styles.mainImg} />
                {problem.images.length > 1 && (
                  <div className={styles.imgNav}>
                    <button className={styles.imgNavBtn} onClick={() => setImgIdx(i => Math.max(0, i - 1))} disabled={imgIdx === 0}>
                      <ChevronLeft size={16} />
                    </button>
                    <span className={styles.imgCounter}>{imgIdx + 1} / {problem.images.length}</span>
                    <button className={styles.imgNavBtn} onClick={() => setImgIdx(i => Math.min(problem.images.length - 1, i + 1))} disabled={imgIdx === problem.images.length - 1}>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
                {problem.images.length > 1 && (
                  <div className={styles.imgThumbs}>
                    {problem.images.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        className={`${styles.thumb} ${i === imgIdx ? styles.thumbActive : ''}`}
                        onClick={() => setImgIdx(i)}
                        alt={`thumbnail ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete */}
          <div className={styles.dangerZone}>
            {!showDeleteConfirm ? (
              <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 size={12} /> Delete Problem
              </button>
            ) : (
              <div className={styles.confirmRow}>
                <span className={styles.confirmText}>Are you sure? This cannot be undone.</span>
                <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn-danger" onClick={() => { onDelete(problem.id); onClose(); }}>
                  Yes, Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
