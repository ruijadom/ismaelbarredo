'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import {useCallback, useEffect, useState} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CarouselPhoto {
  src: string
  alt: string
}

interface PhotoCarouselProps {
  photos:       CarouselPhoto[]
  heightVh?:    number          // fixed slide height in vh units (default 68)
  aspectRatio?: string          // e.g. '4/3', '16/9' — takes priority over heightVh
  maxWidth?:    string          // container max-width (default 100%)
  onOpen?:      (idx: number) => void
}

// ─── PhotoCarousel ────────────────────────────────────────────────────────────

export function PhotoCarousel({photos, heightVh = 68, aspectRatio, maxWidth = '100%', onOpen}: PhotoCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true, align: 'center', dragFree: false})
  const [selected, setSelected] = useState(0)

  // Track selected index
  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div style={{maxWidth, margin: '0 auto', width: '100%'}}>
    <div style={{position: 'relative', width: '100%', userSelect: 'none'}}>

      {/* ── Viewport ── */}
      <div ref={emblaRef} style={{overflow: 'hidden', width: '100%'}}>
        <div style={{display: 'flex'}}>
          {photos.map((photo, i) => (
            <div
              key={i}
              onClick={() => onOpen?.(i)}
              style={{
                flex:        '0 0 100%',
                minWidth:    0,
                position:    'relative',
                background:  '#111',
                cursor:      onOpen ? 'zoom-in' : 'default',
                ...(aspectRatio
                  ? {aspectRatio, width: '100%'}
                  : {height: `${heightVh}vh`}),
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                style={{objectFit: 'cover', opacity: 0.92}}
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Prev arrow ── */}
      <button
        onClick={prev}
        aria-label="Previous"
        style={{
          position:   'absolute',
          left:       'var(--gutter)',
          top:        '50%',
          transform:  'translateY(-50%)',
          background: 'none',
          border:     'none',
          cursor:     'pointer',
          color:      'rgba(244,241,234,0)',
          fontSize:   '22px',
          fontFamily: 'var(--serif)',
          padding:    '12px 8px',
          transition: 'color 200ms ease',
          zIndex:     2,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.80)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0)' }}
      >←</button>

      {/* ── Next arrow ── */}
      <button
        onClick={next}
        aria-label="Next"
        style={{
          position:   'absolute',
          right:      'var(--gutter)',
          top:        '50%',
          transform:  'translateY(-50%)',
          background: 'none',
          border:     'none',
          cursor:     'pointer',
          color:      'rgba(244,241,234,0)',
          fontSize:   '22px',
          fontFamily: 'var(--serif)',
          padding:    '12px 8px',
          transition: 'color 200ms ease',
          zIndex:     2,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.80)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0)' }}
      >→</button>

      {/* ── Dots ── */}
      <div style={{
        position:       'absolute',
        bottom:         '18px',
        left:           0,
        right:          0,
        display:        'flex',
        justifyContent: 'center',
        gap:            '7px',
        pointerEvents:  'none',
      }}>
        {photos.map((_, i) => (
          <span
            key={i}
            style={{
              display:      'block',
              width:        i === selected ? '28px' : '7px',
              height:       '1px',
              background:   i === selected ? 'rgba(244,241,234,0.70)' : 'rgba(244,241,234,0.25)',
              transition:   'width 280ms ease, background 280ms ease',
            }}
          />
        ))}
      </div>

    </div>
    </div>
  )
}
