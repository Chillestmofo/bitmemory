import React, { useState, useEffect } from 'react'
import { PixelBrain } from './PixelIcons'
import styles from './Header.module.css'

import { Github, Twitter, Star } from 'lucide-react'

export function Header({ stats, onAddClick, currentView, setView, user, onLogin, onLogout, syncing }) {
  const [stars, setStars] = useState(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/Chillestmofo/bitmemory')
      .then(r => r.json())
      .then(d => {
        if (d.stargazers_count !== undefined) setStars(d.stargazers_count)
      })
      .catch(console.error)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <PixelBrain size={28} color="#0891b2" />
          <div>
            <span className={styles.logoText}>DSA</span>
            <span className={styles.logoAccent}>.recall</span>
            <div className={styles.logoSub}>spaced repetition for grinders</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navBtn} ${currentView === 'queue' ? styles.navActive : ''}`}
            onClick={() => setView('queue')}
          >
            <span className={styles.navDot} />
            Queue
          </button>
          <button
            className={`${styles.navBtn} ${currentView === 'all' ? styles.navActive : ''}`}
            onClick={() => setView('all')}
          >
            All Problems
          </button>
          <button
            className={`${styles.navBtn} ${currentView === 'stats' ? styles.navActive : ''}`}
            onClick={() => setView('stats')}
          >
            Stats
          </button>
        </nav>

        <div className={styles.right}>
          <div style={{display: 'flex', gap: '16px', marginRight: '16px', alignItems: 'center'}}>
            <a href="https://x.com/chillestmofoo" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text2)', transition: 'color 0.2s', display: 'flex'}} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text2)'}>
              <Twitter size={18} />
            </a>
            <a href="https://github.com/Chillestmofo/bitmemory" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--med)', padding: '6px 14px', borderRadius: '24px',
              textDecoration: 'none', color: 'var(--text1)', fontSize: '14px', fontWeight: '500',
              border: '1px solid var(--light)'
            }}>
              <Github size={16} color="var(--text2)" />
              <Star size={14} fill="#eab308" color="#eab308" />
              <span>{stars !== null ? stars : '-'}</span>
            </a>
          </div>
          {(stats.dueToday > 0 || stats.overdue > 0) && (
            <div className={styles.alertBadge}>
              {stats.overdue > 0 && <span className={styles.badgeRed}>{stats.overdue} overdue</span>}
              {stats.dueToday > 0 && <span className={styles.badgeAmber}>{stats.dueToday} today</span>}
            </div>
          )}
          {user ? (
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <span style={{fontSize:'10px', color:'var(--text2)'}}>
                {syncing ? 'Syncing...' : user.displayName}
              </span>
              <button className="btn-secondary" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={onLogin}>
              Login
            </button>
          )}
          <button className="btn-primary" onClick={onAddClick}>
            + Log Problem
          </button>
        </div>
      </div>
    </header>
  )
}
