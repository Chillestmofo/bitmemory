import React, { useState, useRef, useCallback } from 'react'
import { X, Upload, Link, Tag, FileImage, Trash2 } from 'lucide-react'
import { PLATFORMS, DIFFICULTY_LEVELS, DSA_TAGS, createProblem } from '../lib/storage'
import styles from './AddProblem.module.css'

const EMPTY_FORM = {
  name: '',
  link: '',
  platform: 'LeetCode',
  difficulty: 'Medium',
  tags: [],
  notes: '',
  images: [],
}

export function AddProblem({ onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [dragging, setDragging] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef()

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const toggleTag = (tag) => {
    set('tags', form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag]
    )
  }

  const handleFiles = useCallback((files) => {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          const MAX_DIM = 800
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height *= MAX_DIM / width
              width = MAX_DIM
            } else {
              width *= MAX_DIM / height
              height = MAX_DIM
            }
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6)
          setForm(f => ({ ...f, images: [...f.images, dataUrl] }))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = (i) => {
    set('images', form.images.filter((_, idx) => idx !== i))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Problem name is required'
    if (form.link && !/^https?:\/\/.+/.test(form.link)) errs.link = 'Enter a valid URL'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const problem = createProblem(form)
    onSave(problem)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">// log new problem</span>
          <button className="modal-close" onClick={onClose}><X size={14} /></button>
        </div>

        <div className="modal-body">
          <div className={styles.form}>

            {/* Name */}
            <div className={styles.field}>
              <label>Problem Name *</label>
              <input
                type="text"
                placeholder="e.g. Longest Substring Without Repeating Characters"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                autoFocus
              />
              {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            {/* Link */}
            <div className={styles.field}>
              <label><Link size={10} style={{display:'inline',marginRight:4}} />Question Link</label>
              <input
                type="url"
                placeholder="https://leetcode.com/problems/..."
                value={form.link}
                onChange={e => set('link', e.target.value)}
              />
              {errors.link && <span className={styles.error}>{errors.link}</span>}
            </div>

            {/* Platform + Difficulty */}
            <div className={styles.row2}>
              <div className={styles.field}>
                <label>Platform</label>
                <select value={form.platform} onChange={e => set('platform', e.target.value)}>
                  {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>Difficulty</label>
                <div className={styles.diffRow}>
                  {DIFFICULTY_LEVELS.map(d => (
                    <button
                      key={d}
                      type="button"
                      className={`${styles.diffBtn} ${styles[`diff${d}`]} ${form.difficulty === d ? styles.diffActive : ''}`}
                      onClick={() => set('difficulty', d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className={styles.field}>
              <label><Tag size={10} style={{display:'inline',marginRight:4}} />Pattern / Topic Tags</label>
              <div className={styles.tagGrid}>
                {DSA_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag ${form.tags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className={styles.field}>
              <label>Your Approach / Key Insight</label>
              <textarea
                placeholder="e.g. Used sliding window. Key insight: expand right, shrink left when constraint violated. O(n) time, O(k) space..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div className={styles.field}>
              <label><FileImage size={10} style={{display:'inline',marginRight:4}} />Approach Screenshots</label>
              <div
                className={`${styles.uploadZone} ${dragging ? styles.dragging : ''}`}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => handleFiles(e.target.files)}
                />
                <div className={styles.uploadIcon}>
                  <Upload size={28} color="var(--accent)" />
                </div>
                <p className={styles.uploadText}>
                  Drop screenshots here or <span>click to browse</span>
                </p>
                <p className={styles.uploadSub}>Your hand-written solution, code, approach diagram</p>
              </div>

              {form.images.length > 0 && (
                <div className={styles.imgGrid}>
                  {form.images.map((src, i) => (
                    <div key={i} className={styles.imgWrap}>
                      <img src={src} alt={`screenshot ${i + 1}`} className={styles.imgThumb} />
                      <button
                        className={styles.imgRemove}
                        onClick={() => removeImage(i)}
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revision schedule info */}
            <div className={styles.scheduleInfo}>
              <div className={styles.scheduleTitle}>// revision schedule</div>
              <div className={styles.scheduleDots}>
                {[3, 7, 15, 30].map(d => (
                  <div key={d} className={styles.scheduleDot}>
                    <div className={styles.dotBox}>Day {d}</div>
                    <div className={styles.dotLine} />
                  </div>
                ))}
              </div>
              <p className={styles.scheduleDesc}>Auto-scheduled reminders at day 3 → 7 → 15 → 30</p>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button className="btn-secondary" type="button" onClick={onClose}>Cancel</button>
              <button className="btn-primary" type="button" onClick={handleSubmit}>
                Log + Schedule →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
