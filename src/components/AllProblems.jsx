import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { getProblemStatus, DSA_TAGS } from '../lib/storage'
import { ProblemCard } from './ProblemCard'
import styles from './AllProblems.module.css'

export function AllProblems({ problems, onMarkDone, onViewDetail }) {
  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState('All')
  const [tagFilter, setTagFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = useMemo(() => {
    let arr = [...problems]
    if (search) {
      const q = search.toLowerCase()
      arr = arr.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.platform.toLowerCase().includes(q)
      )
    }
    if (diffFilter !== 'All') arr = arr.filter(p => p.difficulty === diffFilter)
    if (tagFilter) arr = arr.filter(p => p.tags.includes(tagFilter))

    arr.sort((a, b) => {
      if (sortBy === 'newest') return b.addedAt - a.addedAt
      if (sortBy === 'oldest') return a.addedAt - b.addedAt
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })
    return arr
  }, [problems, search, diffFilter, tagFilter, sortBy])

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search problems, tags, platform..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.controls}>
          <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)}>
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}>
            <option value="">All Tags</option>
            {DSA_TAGS.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">A → Z</option>
          </select>
        </div>
      </div>

      <div className={styles.meta}>
        <span className={styles.count}>
          <span className={styles.countNum}>{filtered.length}</span> problem{filtered.length !== 1 ? 's' : ''}
        </span>
        <span className={styles.countSub}>
          {problems.filter(p => getProblemStatus(p) === 'completed').length} fully completed
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No problems found matching your filters.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((p, i) => (
            <ProblemCard
              key={p.id}
              problem={p}
              onMarkDone={onMarkDone}
              onViewDetail={onViewDetail}
              animate
              animIndex={Math.min(i, 10)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
