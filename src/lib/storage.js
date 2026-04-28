import { v4 as uuidv4 } from 'uuid'
import { addDays, startOfDay, format, isToday, isBefore, formatDistanceToNow } from 'date-fns'

export const REVISION_INTERVALS = [3, 7, 15, 30]

export const PLATFORMS = [
  'LeetCode', 'Codeforces', 'GeeksForGeeks', 'HackerRank',
  'SPOJ', 'AtCoder', 'CodeChef', 'InterviewBit', 'Other'
]

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard']

export const DSA_TAGS = [
  'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Two Pointers',
  'Sliding Window', 'Binary Search', 'Sorting', 'Hashing', 'Math',
  'DFS', 'BFS', 'Graph', 'Tree', 'Binary Tree', 'BST', 'Trie',
  'Dynamic Programming', 'Greedy', 'Backtracking', 'Divide & Conquer',
  'Recursion', 'Bit Manipulation', 'Heap', 'Segment Tree', 'Union Find',
  'Monotonic Stack', 'Prefix Sum', 'Matrix'
]

const STORAGE_KEY = 'dsa_recall_problems_v1'

export function loadProblems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveProblems(problems) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems))
  } catch {
    console.error('Failed to save to localStorage')
  }
}

export function createProblem({ name, link, platform, difficulty, tags, notes, images, isSavedOnly }) {
  const today = startOfDay(new Date()).getTime()
  return {
    id: uuidv4(),
    name,
    link,
    platform,
    difficulty,
    tags,
    notes,
    images: images || [],
    addedAt: today,
    isSavedOnly: isSavedOnly || false,
    revisions: isSavedOnly ? [] : REVISION_INTERVALS.map(day => ({
      day,
      dueAt: addDays(today, day).getTime(),
      done: false,
      completedAt: null,
    })),
  }
}

export function getNextRevision(problem) {
  return problem.revisions.find(r => !r.done) || null
}

export function getAllPendingRevisions(problem) {
  return problem.revisions.filter(r => !r.done)
}

export function isRevisionOverdue(revision) {
  return !revision.done && isBefore(revision.dueAt, startOfDay(new Date()))
}

export function isRevisionToday(revision) {
  return !revision.done && isToday(revision.dueAt)
}

export function isRevisionUpcoming(revision) {
  return !revision.done && !isToday(revision.dueAt) && !isBefore(revision.dueAt, new Date())
}

export function getProblemStatus(problem) {
  const next = getNextRevision(problem)
  if (!next) return 'completed'
  if (isRevisionOverdue(next)) return 'overdue'
  if (isRevisionToday(next)) return 'due-today'
  return 'upcoming'
}

export function getDueLabel(revision) {
  if (revision.done) return `Done ${format(revision.completedAt, 'MMM d')}`
  if (isRevisionOverdue(revision)) {
    const d = Math.round((startOfDay(new Date()) - revision.dueAt) / 86400000)
    return `${d}d overdue`
  }
  if (isRevisionToday(revision)) return 'Due today!'
  return `Due ${format(revision.dueAt, 'MMM d')}`
}

export function formatDate(ms) {
  return format(ms, 'MMM d, yyyy')
}

export function markRevisionDone(problem, revisionIndex) {
  const updated = { ...problem }
  updated.revisions = [...problem.revisions]
  updated.revisions[revisionIndex] = {
    ...updated.revisions[revisionIndex],
    done: true,
    completedAt: Date.now(),
  }
  return updated
}

export function getStats(problems) {
  let dueToday = 0
  let overdue = 0
  let completedRevisions = 0
  let totalRevisions = 0

  problems.forEach(p => {
    p.revisions.forEach(r => {
      totalRevisions++
      if (r.done) completedRevisions++
      else if (isRevisionToday(r)) dueToday++
      else if (isRevisionOverdue(r)) overdue++
    })
  })

  return { dueToday, overdue, completedRevisions, totalRevisions, total: problems.length }
}

export function getUpcomingRevisions(problems, days = 14) {
  const result = {}
  const today = startOfDay(new Date()).getTime()
  for (let i = 0; i < days; i++) {
    result[addDays(today, i).getTime()] = []
  }
  problems.forEach(p => {
    p.revisions.forEach(r => {
      if (!r.done && result[r.dueAt] !== undefined) {
        result[r.dueAt].push({ problem: p, revision: r })
      }
    })
  })
  return result
}
