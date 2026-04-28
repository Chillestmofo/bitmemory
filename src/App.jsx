import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { AddProblem } from './components/AddProblem'
import { ProblemDetail } from './components/ProblemDetail'
import { QueueView } from './components/QueueView'
import { AllProblems } from './components/AllProblems'
import { StatsView } from './components/StatsView'
import { LandingHero } from './components/LandingHero'
import { ToastContainer } from './components/Toast'
import { loadProblems, saveProblems, markRevisionDone, getStats } from './lib/storage'
import { useToast } from './hooks/useToast'
import { auth, loginWithGoogle, logoutUser, syncDataToCloud, loadDataFromCloud } from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import styles from './App.module.css'

export default function App() {
  const [problems, setProblems] = useState(() => loadProblems())
  const [view, setView] = useState('queue')
  const [showAdd, setShowAdd] = useState(false)
  const [detailProblem, setDetailProblem] = useState(null)
  const [user, setUser] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const { toasts, toast } = useToast()

  const initializedRef = useRef(false)
  const [stars, setStars] = useState(0)

  useEffect(() => {
    fetch('https://api.github.com/repos/Chillestmofo/bitmemory')
      .then(r => r.json())
      .then(d => {
        if (d.stargazers_count !== undefined) setStars(d.stargazers_count)
      })
      .catch(console.error)
  }, [])

  // Listen to auth
  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        setSyncing(true)
        initializedRef.current = false
        try {
          const cloudData = await loadDataFromCloud(u.uid)
          if (cloudData && cloudData.length > 0) {
            setProblems(prev => {
              // Merge local problems that aren't in the cloud yet
              const cloudIds = new Set(cloudData.map(c => c.id))
              const localOnly = prev.filter(p => !cloudIds.has(p.id))
              return [...cloudData, ...localOnly]
            })
            toast('✓ Data synced from cloud', 'success')
          }
        } catch (err) {
          console.error("Cloud load error:", err)
        }
        initializedRef.current = true
        setSyncing(false)
      } else {
        initializedRef.current = false
      }
    })
    return () => unsubscribe()
  }, [toast])

  // Persist on change
  useEffect(() => {
    saveProblems(problems)
    if (user && initializedRef.current) {
      syncDataToCloud(user.uid, problems).catch(console.error)
    }
  }, [problems, user])

  const stats = getStats(problems)

  const handleAddProblem = useCallback((problem) => {
    setProblems(prev => [problem, ...prev])
    setShowAdd(false)
    toast('✓ Problem logged! Revisions scheduled at day 3, 7, 15, 30.', 'success')
    setView('queue')
  }, [toast])

  const handleMarkDone = useCallback((problemId, revisionIndex) => {
    setProblems(prev => prev.map(p =>
      p.id === problemId ? markRevisionDone(p, revisionIndex) : p
    ))
    toast('✓ Revision marked complete!', 'success')
  }, [toast])

  const handleDelete = useCallback((problemId) => {
    setProblems(prev => prev.filter(p => p.id !== problemId))
    toast('Problem deleted.', 'default')
  }, [toast])

  const showLanding = problems.length === 0 && view === 'queue'

  const handleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      toast('Login failed. Please check Firebase config.', 'error')
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    setProblems([])
    toast('Logged out.', 'default')
  }

  return (
    <div className={styles.app}>
      <Header
        stats={stats}
        onAddClick={() => setShowAdd(true)}
        currentView={view}
        setView={setView}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        syncing={syncing}
      />

      <main className={styles.main}>
        <div className={styles.container}>
          {showLanding ? (
            <LandingHero onAddClick={() => setShowAdd(true)} />
          ) : (
            <>
              {view === 'queue' && (
                <QueueView
                  problems={problems}
                  onMarkDone={handleMarkDone}
                  onViewDetail={setDetailProblem}
                />
              )}
              {view === 'all' && (
                <AllProblems
                  problems={problems}
                  onMarkDone={handleMarkDone}
                  onViewDetail={setDetailProblem}
                />
              )}
              {view === 'stats' && (
                <StatsView problems={problems} />
              )}
            </>
          )}
        </div>
      </main>

      <div style={{
        position: 'fixed',
        bottom: '16px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '13px',
        color: 'var(--text2)',
        fontFamily: 'var(--font-body)',
        fontWeight: '500',
        zIndex: 50
      }}>
        <span>Built by @DeveshKrishn</span>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '4px'}}>
          <a href="https://x.com/chillestmofoo" target="_blank" rel="noopener noreferrer" style={{color: 'var(--text2)', transition: 'color 0.2s', display: 'flex'}} onMouseOver={e => e.currentTarget.style.color = 'var(--text)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text2)'}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.974H5.078z"></path></svg>
          </a>
          <a href="https://github.com/Chillestmofo/bitmemory" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            textDecoration: 'none', color: 'var(--text2)',
            transition: 'color 0.2s'
          }} onMouseOver={e => e.currentTarget.style.color = 'var(--text)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text2)'}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            {stars > 0 && <span>{stars}</span>}
          </a>
        </div>
      </div>

      {showAdd && (
        <AddProblem
          onSave={handleAddProblem}
          onClose={() => setShowAdd(false)}
        />
      )}

      {detailProblem && (
        <ProblemDetail
          problem={detailProblem}
          onClose={() => setDetailProblem(null)}
          onMarkDone={handleMarkDone}
          onDelete={handleDelete}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}
