import React from 'react'

export function PixelSword({ size = 24, color = 'currentColor' }) {
  const s = size / 16
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="2" width="2" height="2" fill={color} />
      <rect x="4" y="4" width="2" height="2" fill={color} />
      <rect x="6" y="6" width="2" height="2" fill={color} />
      <rect x="8" y="8" width="2" height="2" fill={color} />
      <rect x="10" y="10" width="2" height="2" fill={color} />
      <rect x="12" y="12" width="2" height="2" fill={color} />
      <rect x="0" y="8" width="2" height="2" fill={color} />
      <rect x="2" y="6" width="2" height="2" fill={color} />
      <rect x="0" y="10" width="4" height="2" fill={color} />
    </svg>
  )
}

export function PixelBrain({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="2" width="2" height="2" fill={color} />
      <rect x="6" y="2" width="4" height="2" fill={color} />
      <rect x="10" y="2" width="2" height="2" fill={color} />
      <rect x="2" y="4" width="2" height="2" fill={color} />
      <rect x="4" y="4" width="8" height="2" fill={color} />
      <rect x="12" y="4" width="2" height="2" fill={color} />
      <rect x="2" y="6" width="12" height="2" fill={color} />
      <rect x="2" y="8" width="2" height="2" fill={color} />
      <rect x="6" y="8" width="4" height="2" fill={color} />
      <rect x="12" y="8" width="2" height="2" fill={color} />
      <rect x="4" y="10" width="2" height="2" fill={color} />
      <rect x="8" y="10" width="2" height="2" fill={color} />
      <rect x="10" y="10" width="2" height="2" fill={color} />
      <rect x="4" y="12" width="8" height="2" fill={color} />
    </svg>
  )
}

export function PixelStar({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="6" y="0" width="4" height="2" fill={color} />
      <rect x="6" y="2" width="4" height="2" fill={color} />
      <rect x="0" y="6" width="16" height="4" fill={color} />
      <rect x="2" y="4" width="2" height="2" fill={color} />
      <rect x="12" y="4" width="2" height="2" fill={color} />
      <rect x="4" y="8" width="2" height="6" fill={color} />
      <rect x="10" y="8" width="2" height="6" fill={color} />
      <rect x="2" y="10" width="2" height="2" fill={color} />
      <rect x="12" y="10" width="2" height="2" fill={color} />
    </svg>
  )
}

export function PixelCheck({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="8" width="2" height="2" fill={color} />
      <rect x="2" y="10" width="2" height="2" fill={color} />
      <rect x="4" y="12" width="2" height="2" fill={color} />
      <rect x="6" y="10" width="2" height="2" fill={color} />
      <rect x="8" y="8" width="2" height="2" fill={color} />
      <rect x="10" y="6" width="2" height="2" fill={color} />
      <rect x="12" y="4" width="2" height="2" fill={color} />
      <rect x="14" y="2" width="2" height="2" fill={color} />
    </svg>
  )
}

export function PixelClock({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="0" width="8" height="2" fill={color} />
      <rect x="2" y="2" width="2" height="2" fill={color} />
      <rect x="12" y="2" width="2" height="2" fill={color} />
      <rect x="0" y="4" width="2" height="8" fill={color} />
      <rect x="14" y="4" width="2" height="8" fill={color} />
      <rect x="2" y="12" width="2" height="2" fill={color} />
      <rect x="12" y="12" width="2" height="2" fill={color} />
      <rect x="4" y="14" width="8" height="2" fill={color} />
      <rect x="6" y="4" width="2" height="4" fill={color} />
      <rect x="8" y="6" width="4" height="2" fill={color} />
    </svg>
  )
}

export function PixelTrophy({ size = 32, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
      <rect x="2" y="0" width="12" height="2" fill={color} />
      <rect x="0" y="2" width="2" height="4" fill={color} />
      <rect x="14" y="2" width="2" height="4" fill={color} />
      <rect x="2" y="2" width="12" height="6" fill={color} />
      <rect x="0" y="4" width="2" height="2" fill={color} opacity="0.5" />
      <rect x="14" y="4" width="2" height="2" fill={color} opacity="0.5" />
      <rect x="4" y="8" width="8" height="2" fill={color} />
      <rect x="6" y="10" width="4" height="2" fill={color} />
      <rect x="4" y="12" width="8" height="2" fill={color} />
      <rect x="2" y="14" width="12" height="2" fill={color} />
    </svg>
  )
}
