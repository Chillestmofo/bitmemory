import React from 'react'
import { Link2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

export function SavedProblems({ problems, onDelete, onViewDetail }) {
  const savedProblems = problems.filter(p => p.isSavedOnly)

  if (savedProblems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)', fontFamily: 'var(--font-pixel)', fontSize: '8px', lineHeight: 1.6 }}>
        <div style={{ fontSize: '14px', marginBottom: '16px' }}>¯\_(ツ)_/¯</div>
        <p>No saved problems yet.</p>
        <p style={{ marginTop: '8px' }}>Use "Save for Later" when logging a problem<br/>to keep it out of your spaced repetition schedule.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {savedProblems.map(problem => (
        <div key={problem.id} style={{
          background: 'var(--bg)', border: '2px solid var(--border-strong)',
          boxShadow: '4px 4px 0px var(--border-strong)', padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: '18px', color: 'var(--text1)' }}>
              {problem.name}
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className={`diff-badge diff-${problem.difficulty}`}>{problem.difficulty}</span>
              <span style={{ fontSize: '10px', color: 'var(--text3)', background: 'var(--bg3)', padding: '4px 8px', borderRadius: '4px' }}>
                {problem.platform}
              </span>
            </div>
          </div>

          {problem.tags && problem.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {problem.tags.map(t => (
                <span key={t} className="tag" style={{ cursor: 'default' }}>{t}</span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1.5px dashed var(--border-light)' }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              {problem.link && (
                <a href={problem.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', textDecoration: 'none' }}>
                  <Link2 size={12} /> Open Problem
                </a>
              )}
              {problem.images && problem.images.length > 0 && (
                <span style={{ color: 'var(--text3)' }}>
                  {problem.images.length} screenshot{problem.images.length > 1 ? 's' : ''}
                </span>
              )}
              <span style={{ color: 'var(--text3)' }}>
                Saved {format(problem.addedAt, 'MMM d, yyyy')}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" onClick={() => onViewDetail(problem)}>
                DETAILS
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
