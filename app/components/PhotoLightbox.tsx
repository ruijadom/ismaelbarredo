'use client'

import Image from 'next/image'
import {useState, useEffect, useCallback} from 'react'
import type {CarouselPhoto} from '@/app/components/PhotoCarousel'

// ─── PhotoLightbox ────────────────────────────────────────────────────────────

interface PhotoLightboxProps {
  photos:     CarouselPhoto[]
  startIdx:   number
  closeLabel: string
  onClose:    () => void
}

export function PhotoLightbox({photos, startIdx, closeLabel, onClose}: PhotoLightboxProps) {
  const [idx,     setIdx]     = useState(startIdx)
  const [visible, setVisible] = useState(false)

  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  const prev = useCallback(() => setIdx(i => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setIdx(i => (i + 1) % photos.length), [photos.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = orig }
  }, [])

  return (
    <div
      onClick={onClose}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         300,
        background:     `rgba(10,10,11,${visible ? 0.97 : 0})`,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        transition:     'background 300ms ease',
      }}
    >
      {/* Top bar */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:       'absolute',
          top: 0, left: 0, right: 0,
          padding:        'clamp(18px, 3vw, 30px) clamp(20px, 3.5vw, 36px)',
          display:        'flex',
          justifyContent: 'flex-end',
          opacity:        visible ? 1 : 0,
          transition:     'opacity 400ms ease 120ms',
        }}
      >
        <button
          onClick={onClose}
          aria-label={closeLabel}
          style={{
            background: 'none', border: 'none',
            color:      'rgba(244,241,234,0.35)',
            fontFamily: 'var(--serif)', fontSize: '26px',
            lineHeight: 1, cursor: 'pointer', padding: '4px 8px',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.85)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.35)' }}
        >×</button>
      </div>

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:  'relative',
          width:     'min(1000px, 90vw)',
          opacity:   visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.975)',
          transition:'opacity 380ms ease 80ms, transform 380ms ease 80ms',
        }}
      >
        <div style={{position: 'relative', width: '100%', background: '#0d0d0d', overflow: 'hidden'}}>
          <Image
            key={photos[idx].src}
            src={photos[idx].src}
            alt={photos[idx].alt}
            width={1800}
            height={1200}
            style={{
              width: '100%', height: 'auto',
              maxHeight: '70vh', objectFit: 'contain', display: 'block',
            }}
            sizes="min(1000px, 90vw)"
          />

          {/* Prev / Next */}
          {photos.length > 1 && (
            <>
              <button onClick={prev} aria-label="Previous"
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '22%',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                  paddingLeft: '20px', color: 'rgba(244,241,234,0)',
                  fontSize: '20px', fontFamily: 'var(--serif)', transition: 'color 200ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.75)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0)' }}
              >←</button>
              <button onClick={next} aria-label="Next"
                style={{
                  position: 'absolute', right: 0, top: 0, bottom: 0, width: '22%',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  paddingRight: '20px', color: 'rgba(244,241,234,0)',
                  fontSize: '20px', fontFamily: 'var(--serif)', transition: 'color 200ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.75)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0)' }}
              >→</button>
            </>
          )}
        </div>

        {/* Counter + dots */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingInline: '2px'}}>
          <span style={{
            fontFamily: 'var(--serif)', fontSize: '11px', letterSpacing: '0.32em',
            textTransform: 'lowercase', color: 'rgba(244,241,234,0.28)', minWidth: '40px',
          }}>
            {String(idx + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>
          <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Photo ${i + 1}`}
                style={{
                  width:      i === idx ? '28px' : '8px',
                  height:     '1px',
                  background: i === idx ? 'rgba(244,241,234,0.55)' : 'rgba(244,241,234,0.18)',
                  border:     'none', padding: 0, cursor: 'pointer',
                  transition: 'width 280ms ease, background 280ms ease',
                }}
              />
            ))}
          </div>
          <span style={{minWidth: '40px'}} />
        </div>
      </div>
    </div>
  )
}
