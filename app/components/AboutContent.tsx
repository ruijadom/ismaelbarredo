'use client'

import Image from 'next/image'
import {useState, useEffect, useCallback} from 'react'
import {useLang} from '@/app/components/LanguageContext'

// ─── Content ──────────────────────────────────────────────────────────────────

const copy = {
  es: {
    hero: {
      name:    'Ismael Barredo',
      role:    'músico · compositor · live looper · musicoterapeuta · educador social',
      eyebrow: 'sobre el artista',
    },
    bio: {
      eyebrow: '— bio',
      paragraphs: [
        'Originario de Madrid, del barrio de Hortaleza, Ismael Barredo es un artista multidisciplinar, músico, musicoterapeuta, educador social y creador audiovisual cuyo trabajo explora la relación entre sonido, emoción e imagen a través de propuestas que transitan entre la música contemporánea, el arte inmersivo y social, y la performance audiovisual.',
        'Su práctica artística combina composición musical, improvisación, live looping, handpan, electrónica ambiental y creación visual, desarrollando experiencias donde lo sonoro y lo audiovisual dialogan desde una perspectiva profundamente sensorial y emocional.',
        'A través de instrumentos acústicos y electrónicos, construye paisajes sonoros que oscilan entre lo orgánico y lo tecnológico, integrando procesos de creación en tiempo real, escucha profunda y narrativa atmosférica.',
      ],
    },
    projects: {
      eyebrow:  '— proyectos',
      rows: [
        {
          num:   '01',
          name:  'Invisibles',
          sub:   'performance audiovisual · instalación',
          desc:  'Un proyecto hispano-portugués que explora la experiencia de las enfermedades invisibles a través del videoarte, la música en directo y el testimonio en primera persona.',
          href:  '/',
          arrow: '→',
        },
        {
          num:   '02',
          name:  'Handpan',
          sub:   'conciertos contemplativos · experiencias sonoras',
          desc:  'Composiciones originales e improvisación en directo. El handpan como herramienta de conexión emocional, presencia y escucha profunda.',
          href:  'https://youtu.be/mqqt1zcE23o?si=2ZEIpyXcCW3kXxdz',
          arrow: '↗',
        },
        {
          num:   '03',
          name:  'Sesiones Ambient',
          sub:   'live looping · electrónica orgánica',
          desc:  'Paisajes sonoros construidos en tiempo real mediante capas, texturas y secuencias. Ambient contemporáneo, downtempo y electrónica orgánica.',
          href:  'https://youtube.com/playlist?list=PLGd4ULnfIszWfs9jrn67DJhK1mo4UIeNG&si=ZBJtdPJfemTqkgWD',
          arrow: '↗',
        },
        {
          num:   '04',
          name:  'Cuerpo en Escucha',
          sub:   'ecstatic dance · movimiento libre',
          desc:  'Recorridos musicales progresivos a través de la electrónica orgánica, tribal y melodic. Una narrativa sonora para acompañar la experiencia corporal colectiva.',
          href:  '',
          arrow: '',
        },
        {
          num:   '05',
          name:  'Música para Escena',
          sub:   'teatro · piezas audiovisuales',
          desc:  'Composiciones originales orientadas a la creación de atmósferas emocionales y narrativas sonoras al servicio de la imagen, el movimiento y la escena.',
          href:  '',
          arrow: '',
        },
      ],
    },
    contact: {
      eyebrow: '— contacto · booking',
      line:    'Para conciertos, proyectos o colaboraciones:',
      email:   'ismaelbarredo@gmail.com',
      socials: [
        {label: 'instagram', href: 'https://www.instagram.com/musictomove/'},
        {label: 'youtube',   href: 'https://www.youtube.com/@IsmaelBarredo_MusictoMove'},
        {label: 'facebook',  href: 'https://www.facebook.com/IsmaelBarredoMusictomove'},
      ],
    },
    foot: {
      left:  'Ismael Barredo · 2026',
      right: 'invisibles — lo que no se ve, también duele',
    },
    carousel: {
      close:   'cerrar',
      verMas:  'ver más',
      verProj: 'ver proyecto',
    },
  },

  en: {
    hero: {
      name:    'Ismael Barredo',
      role:    'musician · composer · live looper · music therapist · social educator',
      eyebrow: 'about the artist',
    },
    bio: {
      eyebrow: '— bio',
      paragraphs: [
        "From Madrid's Hortaleza neighbourhood, Ismael Barredo is a multidisciplinary artist, musician, music therapist, social educator, and audiovisual creator whose work explores the relationship between sound, emotion, and image through proposals that move between contemporary music, immersive and social art, and audiovisual performance.",
        'His artistic practice combines musical composition, improvisation, live looping, handpan, ambient electronics, and visual creation, developing experiences where sound and the audiovisual speak from a deeply sensory and emotional perspective.',
        'Through acoustic and electronic instruments, he builds soundscapes that oscillate between the organic and the technological, integrating real-time creation processes, deep listening, and atmospheric narrative.',
      ],
    },
    projects: {
      eyebrow:  '— projects',
      rows: [
        {
          num:   '01',
          name:  'Invisibles',
          sub:   'audiovisual performance · installation',
          desc:  'A Spanish-Portuguese project exploring the experience of invisible illnesses through video art, live music, and first-person testimony.',
          href:  '/',
          arrow: '→',
        },
        {
          num:   '02',
          name:  'Handpan',
          sub:   'contemplative concerts · sonic experiences',
          desc:  'Original compositions and live improvisation. The handpan as a tool for emotional connection, presence, and deep listening.',
          href:  'https://youtu.be/mqqt1zcE23o?si=2ZEIpyXcCW3kXxdz',
          arrow: '↗',
        },
        {
          num:   '03',
          name:  'Ambient Sessions',
          sub:   'live looping · organic electronics',
          desc:  'Soundscapes built in real time through layers, textures, and sequences. Contemporary ambient, downtempo, and organic electronics.',
          href:  'https://youtube.com/playlist?list=PLGd4ULnfIszWfs9jrn67DJhK1mo4UIeNG&si=ZBJtdPJfemTqkgWD',
          arrow: '↗',
        },
        {
          num:   '04',
          name:  'Body Listening',
          sub:   'ecstatic dance · free movement',
          desc:  'Progressive musical journeys through organic, tribal, and melodic electronics. A sonic narrative to accompany collective bodily experience.',
          href:  '',
          arrow: '',
        },
        {
          num:   '05',
          name:  'Music for Stage',
          sub:   'theatre · audiovisual pieces',
          desc:  'Original compositions aimed at creating emotional atmospheres and sonic narratives in service of image, movement, and the stage.',
          href:  '',
          arrow: '',
        },
      ],
    },
    contact: {
      eyebrow: '— contact · booking',
      line:    'For concerts, projects or collaborations:',
      email:   'ismaelbarredo@gmail.com',
      socials: [
        {label: 'instagram', href: 'https://www.instagram.com/musictomove/'},
        {label: 'youtube',   href: 'https://www.youtube.com/@IsmaelBarredo_MusictoMove'},
        {label: 'facebook',  href: 'https://www.facebook.com/IsmaelBarredoMusictomove'},
      ],
    },
    foot: {
      left:  'Ismael Barredo · 2026',
      right: 'invisibles — what you cannot see, still hurts',
    },
    carousel: {
      close:   'close',
      verMas:  'watch more',
      verProj: 'view project',
    },
  },
} as const

// ─── Photo data (language-independent) ───────────────────────────────────────

const PROJECT_PHOTOS: Record<string, string[]> = {
  '01': ['/images/invisibles-1.jpg',    '/images/invisibles-2.jpg'],
  '02': ['/images/handpan-1.webp',      '/images/handpan-2.webp', '/images/handpan-3.webp', '/images/handpan-4.webp'],
  '03': ['/images/live-looping-1.webp', '/images/live-looping-2.webp', '/images/live-looping-3.webp'],
  '04': ['/images/ecstatic-dance-1.webp'],
  '05': ['/images/bio-stage.webp',      '/images/bio-performance.webp'],
}

// ─── PhotoCarousel ────────────────────────────────────────────────────────────

interface CarouselProps {
  photos:     string[]
  name:       string
  num:        string
  href:       string
  arrow:      string
  verMas:     string
  verProj:    string
  closeLabel: string
  onClose:    () => void
}

function PhotoCarousel({photos, name, num, href, arrow, verMas, verProj, closeLabel, onClose}: CarouselProps) {
  const [idx,     setIdx]     = useState(0)
  const [visible, setVisible] = useState(false)

  // Fade-in on mount
  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  const prev = useCallback(() => setIdx(i => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setIdx(i => (i + 1) % photos.length), [photos.length])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, prev, next])

  // Lock body scroll while open
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = orig }
  }, [])

  const isExternal = href.startsWith('http')
  const linkLabel  = isExternal ? verMas : verProj
  const linkSuffix = isExternal ? ' ↗' : ` ${arrow}`

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

      {/* ── Top bar ── */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:   'absolute',
          top: 0, left: 0, right: 0,
          padding:    'clamp(18px, 3vw, 30px) clamp(20px, 3.5vw, 36px)',
          display:    'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity:    visible ? 1 : 0,
          transition: 'opacity 400ms ease 120ms',
        }}
      >
        <div>
          <span style={{
            fontFamily:    'var(--serif)',
            fontSize:      '11px',
            letterSpacing: '0.32em',
            textTransform: 'lowercase',
            color:         'rgba(244,241,234,0.30)',
          }}>{num} · </span>
          <span style={{
            fontFamily:    'var(--serif)',
            fontSize:      '13px',
            letterSpacing: '0.16em',
            textTransform: 'lowercase',
            color:         'rgba(244,241,234,0.60)',
          }}>{name}</span>
        </div>

        <button
          onClick={onClose}
          aria-label={closeLabel}
          style={{
            background: 'none',
            border:     'none',
            color:      'rgba(244,241,234,0.35)',
            fontFamily: 'var(--serif)',
            fontSize:   '26px',
            lineHeight: 1,
            cursor:     'pointer',
            padding:    '4px 8px',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.85)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.35)' }}
        >×</button>
      </div>

      {/* ── Image ── */}
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
            key={photos[idx]}
            src={photos[idx]}
            alt={`${name} ${idx + 1}`}
            width={1200}
            height={800}
            style={{
              width:     '100%',
              height:    'auto',
              maxHeight: '70vh',
              objectFit: 'contain',
              display:   'block',
            }}
            sizes="min(1000px, 90vw)"
          />

          {/* Prev / next — over image edges */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                style={{
                  position:       'absolute',
                  left: 0, top: 0, bottom: 0,
                  width:          '22%',
                  background:     'none',
                  border:         'none',
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'flex-start',
                  paddingLeft:    '20px',
                  color:          'rgba(244,241,234,0)',
                  fontSize:       '20px',
                  fontFamily:     'var(--serif)',
                  transition:     'color 200ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.75)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0)' }}
              >←</button>

              <button
                onClick={next}
                aria-label="Next"
                style={{
                  position:       'absolute',
                  right: 0, top: 0, bottom: 0,
                  width:          '22%',
                  background:     'none',
                  border:         'none',
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'flex-end',
                  paddingRight:   '20px',
                  color:          'rgba(244,241,234,0)',
                  fontSize:       '20px',
                  fontFamily:     'var(--serif)',
                  transition:     'color 200ms ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0.75)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(244,241,234,0)' }}
              >→</button>
            </>
          )}
        </div>

        {/* ── Caption / progress row ── */}
        <div style={{
          display:         'flex',
          justifyContent:  'space-between',
          alignItems:      'center',
          marginTop:       '14px',
          paddingInline:   '2px',
        }}>
          {/* Counter */}
          <span style={{
            fontFamily:    'var(--serif)',
            fontSize:      '11px',
            letterSpacing: '0.32em',
            textTransform: 'lowercase',
            color:         'rgba(244,241,234,0.28)',
            minWidth:      '40px',
          }}>
            {String(idx + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
          </span>

          {/* Progress lines */}
          {photos.length > 1 && (
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
                    border:     'none',
                    padding:    0,
                    cursor:     'pointer',
                    transition: 'width 280ms ease, background 280ms ease',
                  }}
                />
              ))}
            </div>
          )}

          {/* Link */}
          {href ? (
            <a
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              style={{
                fontFamily:     'var(--serif)',
                fontSize:       '11px',
                letterSpacing:  '0.32em',
                textTransform:  'lowercase',
                color:          'rgba(244,241,234,0.32)',
                textDecoration: 'none',
                transition:     'color 200ms ease',
                whiteSpace:     'nowrap',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(244,241,234,0.78)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(244,241,234,0.32)' }}
            >{linkLabel}{linkSuffix}</a>
          ) : <span />}
        </div>
      </div>

    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AboutContent() {
  const {lang} = useLang()
  const c      = copy[lang]

  const [activeNum, setActiveNum] = useState<string | null>(null)

  const activeRow    = activeNum ? c.projects.rows.find(r => r.num === activeNum) ?? null : null
  const activePhotos = activeNum ? (PROJECT_PHOTOS[activeNum] ?? []) : []

  const openCarousel  = useCallback((num: string) => setActiveNum(num), [])
  const closeCarousel = useCallback(() => setActiveNum(null), [])

  return (
    <div className="page" id="about-content">

      {/* ── Hero ── */}
      <section className="about-hero">
        <p className="eyebrow" style={{marginBottom: '1.5rem'}}>{c.hero.eyebrow}</p>
        <h1 className="about-hero__name">{c.hero.name}</h1>
        <p className="about-hero__role">{c.hero.role}</p>
      </section>

      {/* ── Portrait ── */}
      <div className="about-portrait">
        <Image
          src="/images/bio-stage.webp"
          alt="Ismael Barredo"
          width={900}
          height={600}
          style={{objectFit: 'cover', objectPosition: 'center top', display: 'block'}}
          sizes="(max-width: 760px) 94vw, 900px"
          priority
        />
      </div>

      {/* ── Bio ── */}
      <section className="section">
        <div className="col">
          <p className="eyebrow">{c.bio.eyebrow}</p>
          <div className="prose">
            {c.bio.paragraphs.map((p, i) => (
              <p key={i}>{i === 0 ? <em>{p}</em> : p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects index ── */}
      <section className="section">
        <div className="col--full" style={{maxWidth: 'min(960px, 92vw)', margin: '0 auto'}}>
          <div className="projects-head">
            <p className="eyebrow" style={{margin: 0}}>{c.projects.eyebrow}</p>
            <span className="projects-head__count">0{c.projects.rows.length}</span>
          </div>

          <div className="projects">
            {c.projects.rows.map(({num, name, sub, desc, arrow}) => (
              <div
                key={num}
                className="project-row project-row--link"
                style={{textDecoration: 'none', color: 'inherit', cursor: 'pointer'}}
                onClick={() => openCarousel(num)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openCarousel(num) }}
              >
                <span className="project-row__num">{num}</span>
                <div>
                  <p className="project-row__name">
                    {name} <em>{sub}</em>
                  </p>
                </div>
                <p className="project-row__desc">{desc}</p>
                <span className="project-row__arrow">{arrow || '↗'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / Booking ── */}
      <section className="section section--airy contact">
        <div className="col">
          <span className="rule rule--center" />
          <p className="eyebrow" style={{marginBottom: 0}}>{c.contact.eyebrow}</p>
          <p className="contact__line">{c.contact.line}</p>
          <a className="contact__email" href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
          <div className="contact__socials">
            {c.contact.socials.map(({label, href}) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="foot">
        <span>{c.foot.left}</span>
        <span>{c.foot.right}</span>
        <a
          href="https://www.ruijadom.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily:    'var(--serif)',
            fontSize:      '0.58rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         'var(--ink-faint)',
            textDecoration: 'none',
            transition:    'color 0.3s ease',
            width:         '100%',
            marginTop:     '1rem',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink-soft)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink-faint)' }}
        >
          created by ruijadom.com
        </a>
      </footer>

      {/* ── Photo carousel overlay ── */}
      {activeRow && activePhotos.length > 0 && (
        <PhotoCarousel
          key={activeNum!}
          photos={activePhotos}
          name={activeRow.name}
          num={activeRow.num}
          href={activeRow.href}
          arrow={activeRow.arrow}
          verMas={c.carousel.verMas}
          verProj={c.carousel.verProj}
          closeLabel={c.carousel.close}
          onClose={closeCarousel}
        />
      )}

    </div>
  )
}
