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
          {(stats.dueToday > 0 || stats.overdue > 0) && (
            <div className={styles.alertBadge}>
              {stats.overdue > 0 && <span className={styles.badgeRed}>{stats.overdue} overdue</span>}
              {stats.dueToday > 0 && <span className={styles.badgeAmber}>{stats.dueToday} today</span>}
            </div>
          )}
          {user ? (
            <div 
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px', 
                background: 'var(--bg)', border: '2px solid var(--text)', 
                boxShadow: '2px 2px 0px var(--text)', padding: '6px 12px'
              }}
            >
              <span style={{fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text2)', fontWeight: '500'}}>
                {syncing ? 'Syncing...' : user.displayName}
              </span>
              <span style={{color: 'var(--text3)', fontSize: '12px'}}>|</span>
              <button 
                onClick={onLogout}
                style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  fontFamily: 'var(--font-pixel)', fontSize: '7px', color: 'var(--text)',
                  textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text)'}
              >
                LOGOUT
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
