import React from 'react'
import { PixelBrain } from './PixelIcons'
import styles from './Header.module.css'

import { Github, Twitter } from 'lucide-react'

export function Header({ stats, onAddClick, currentView, setView, user, onLogin, onLogout, syncing }) {
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
          <div style={{display: 'flex', gap: '10px', marginRight: '8px', alignItems: 'center'}}>
            <a href="https://twitter.com/your_handle" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text2)', transition: 'color 0.2s'}} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text2)'}>
              <Twitter size={14} />
            </a>
            <a href="https://github.com/Chillestmofo" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text2)', transition: 'color 0.2s'}} onMouseOver={e => e.currentTarget.style.color = 'var(--accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text2)'}>
              <Github size={14} />
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
