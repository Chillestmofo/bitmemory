import React from 'react'
import { getProblemStatus, getStats, REVISION_INTERVALS } from '../lib/storage'
import { format } from 'date-fns'
import { PixelTrophy } from './PixelIcons'
import styles from './StatsView.module.css'

const TAG_COLORS = ['var(--cyan-600)', 'var(--accent)', 'var(--cyan-800)', 'var(--cyan-500)', 'var(--cyan-700)']

export function StatsView({ problems }) {
  const stats = getStats(problems)

  const tagFreq = {}
  problems.forEach(p => p.tags.forEach(t => { tagFreq[t] = (tagFreq[t] || 0) + 1 }))
  const topTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const maxTagCount = topTags[0]?.[1] || 1

  const platformFreq = {}
  problems.forEach(p => { platformFreq[p.platform] = (platformFreq[p.platform] || 0) + 1 })

  const diffFreq = { Easy: 0, Medium: 0, Hard: 0 }
  problems.forEach(p => { diffFreq[p.difficulty]++ })

  const completionPct = stats.totalRevisions > 0
    ? Math.round((stats.completedRevisions / stats.totalRevisions) * 100)
    : 0

  const recentActivity = problems
    .flatMap(p => p.revisions.filter(r => r.done && r.completedAt).map(r => ({ ...r, problemName: p.name })))
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 8)

  return (
    <div className={styles.wrap}>
      {/* Top stats */}
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{problems.length}</div>
          <div className={styles.statLabel}>Problems Logged</div>
        </div>
        <div className={`${styles.statCard} ${stats.overdue > 0 ? styles.statDanger : ''}`}>
          <div className={styles.statValue}>{stats.overdue}</div>
          <div className={styles.statLabel}>Overdue</div>
        </div>
        <div className={`${styles.statCard} ${stats.dueToday > 0 ? styles.statWarn : ''}`}>
          <div className={styles.statValue}>{stats.dueToday}</div>
          <div className={styles.statLabel}>Due Today</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.completedRevisions}</div>
          <div className={styles.statLabel}>Revisions Done</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{completionPct}%</div>
          <div className={styles.statLabel}>Completion Rate</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{problems.filter(p => getProblemStatus(p) === 'completed').length}</div>
          <div className={styles.statLabel}>Fully Mastered</div>
        </div>
      </div>

      <div className={styles.row2}>
        {/* Difficulty distribution */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>// difficulty split</div>
          <div className={styles.diffBars}>
            {Object.entries(diffFreq).map(([d, count]) => (
              <div key={d} className={styles.diffBar}>
                <div className={styles.diffBarLabel}>
                  <span className={`diff-badge diff-${d.toLowerCase()}`}>{d}</span>
                  <span className={styles.diffBarCount}>{count}</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={`${styles.barFill} ${styles[`barFill${d}`]}`}
                    style={{ width: problems.length ? `${(count / problems.length) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revision progress */}
        <div className={styles.panel}>
          <div className={styles.panelTitle}>// revision funnel</div>
          <div className={styles.funnelRows}>
            {REVISION_INTERVALS.map(d => {
              const doneCount = problems.filter(p => p.revisions.find(r => r.day === d && r.done)).length
              return (
                <div key={d} className={styles.funnelRow}>
                  <span className={styles.funnelLabel}>Day {d}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: problems.length ? `${(doneCount / problems.length) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className={styles.funnelCount}>{doneCount}/{problems.length}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top tags */}
      {topTags.length > 0 && (
        <div className={styles.panel}>
          <div className={styles.panelTitle}>// top patterns practiced</div>
          <div className={styles.tagBars}>
            {topTags.map(([tag, count], i) => (
              <div key={tag} className={styles.tagBar}>
                <span className={styles.tagBarName}>{tag}</span>
                <div className={styles.tagBarTrack}>
                  <div
                    className={styles.tagBarFill}
                    style={{
                      width: `${(count / maxTagCount) * 100}%`,
                      background: TAG_COLORS[i % TAG_COLORS.length]
                    }}
                  />
                </div>
                <span className={styles.tagBarCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className={styles.panel}>
          <div className={styles.panelTitle}>// recent activity</div>
          <div className={styles.activityList}>
            {recentActivity.map((r, i) => (
              <div key={i} className={styles.activityRow}>
                <span className={styles.activityCheck}>✓</span>
                <div className={styles.activityInfo}>
                  <span className={styles.activityName}>{r.problemName}</span>
                  <span className={styles.activityDay}>Day {r.day} revision</span>
                </div>
                <span className={styles.activityDate}>{format(r.completedAt, 'MMM d')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {problems.length === 0 && (
        <div className="empty-state" style={{ padding: '80px 24px' }}>
          <div className="empty-pixel">
            <PixelTrophy size={64} color="var(--border-strong)" />
          </div>
          <p>Stats will appear once you start logging problems.<br />Go crush some DSA!</p>
        </div>
      )}
    </div>
  )
}
