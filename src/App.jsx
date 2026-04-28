import React, { useState, useCallback, useEffect } from 'react'
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

  // Listen to auth
  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        setSyncing(true)
        try {
          const cloudData = await loadDataFromCloud(u.uid)
          if (cloudData && cloudData.length > 0) {
            setProblems(cloudData)
            toast('✓ Data synced from cloud', 'success')
          }
        } catch (err) {
          console.error("Cloud load error:", err)
        }
        setSyncing(false)
      }
    })
    return () => unsubscribe()
  }, [toast])

  // Persist on change
  useEffect(() => {
    saveProblems(problems)
    if (user && problems.length > 0) {
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
