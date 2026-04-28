import React from 'react'
import styles from './LandingHero.module.css'

export function LandingHero({ onAddClick }) {
  return (
    <div className={styles.hero}>
      <div className={styles.pixelCharacter}>
        <svg width="80" height="80" viewBox="0 0 20 20" style={{ imageRendering: 'pixelated' }}>
          {/* Pixel dude sitting at computer */}
          <rect x="8" y="1" width="4" height="4" fill="var(--cyan-400)" />
          <rect x="7" y="5" width="6" height="5" fill="var(--accent)" />
          <rect x="5" y="6" width="2" height="3" fill="var(--accent)" />
          <rect x="13" y="6" width="2" height="3" fill="var(--accent)" />
          <rect x="7" y="10" width="2" height="4" fill="var(--accent)" />
          <rect x="11" y="10" width="2" height="4" fill="var(--accent)" />
          <rect x="6" y="14" width="3" height="2" fill="var(--text)" />
          <rect x="11" y="14" width="3" height="2" fill="var(--text)" />
          {/* eyes */}
          <rect x="9" y="2" width="1" height="1" fill="var(--text)" />
          <rect x="11" y="2" width="1" height="1" fill="var(--text)" />
          {/* smile */}
          <rect x="9" y="4" width="3" height="1" fill="var(--text)" />
        </svg>
      </div>

      <h1 className={styles.headline}>
        Never forget a<br />
        <span className={styles.accent}>DSA pattern</span> again.
      </h1>

      <p className={styles.sub}>
        Log problems you solve. Upload your approach.<br />
        Get reminded on day <b>3 → 7 → 15 → 30</b> using spaced repetition.
      </p>

      <button className={`btn-primary ${styles.cta}`} onClick={onAddClick}>
        Log Your First Problem →
      </button>

      <div className={styles.howIt}>
        <div className={styles.howItTitle}>// how it works</div>
        <div className={styles.steps}>
          {[
            { num: '01', label: 'Log a problem', desc: 'Paste the link, pick a pattern tag, write your key insight.' },
            { num: '02', label: 'Upload your approach', desc: 'Drop screenshots of your handwritten solution or code.' },
            { num: '03', label: 'Get reminded', desc: 'DSA Recall schedules reviews at day 3, 7, 15, and 30.' },
            { num: '04', label: 'Never forget', desc: 'Each revision cements the pattern deeper into long-term memory.' },
          ].map(s => (
            <div key={s.num} className={styles.step}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepLabel}>{s.label}</div>
              <div className={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sciNote}>
        <span className={styles.sciIcon}>&#128217;</span>
        Based on <b>Hermann Ebbinghaus's Forgetting Curve</b> — reviewing at optimal intervals prevents memory decay and builds lasting pattern recognition.
      </div>
    </div>
  )
}
