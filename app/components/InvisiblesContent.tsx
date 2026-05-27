'use client'

import {useState, useCallback} from 'react'
import {useLang} from '@/app/components/LanguageContext'
import {PhotoCarousel} from '@/app/components/PhotoCarousel'
import {PhotoLightbox} from '@/app/components/PhotoLightbox'

// ─── Content ──────────────────────────────────────────────────────────────────

const copy = {
  es: {
    hero: {
      eyebrow: 'proyectos artísticos',
      title:   'Invisibles',
      sub:     'proyecto artístico hispano-portugués',
    },
    desc: {
      eyebrow: '— el proyecto',
      paragraphs: [
        'Invisibles es un proyecto artístico hispano-portugués que explora la experiencia de las enfermedades invisibles a través del videoarte, la música en directo, la instalación audiovisual y el testimonio en primera persona.',
        'La propuesta nace de la necesidad de generar espacios de escucha y visibilización en torno a realidades frecuentemente silenciadas o incomprendidas, utilizando el lenguaje artístico como herramienta de conexión humana, empatía y reflexión colectiva.',
        'El proyecto se articula mediante una serie de piezas audiovisuales construidas a partir de relatos reales de personas que conviven con distintas enfermedades invisibles. A través de la integración de imagen, composición sonora y voz testimonial, Invisibles desarrolla una experiencia inmersiva donde lo visual, lo emocional y lo sonoro funcionan como una misma estructura narrativa y sensorial.',
        'La obra se sitúa entre el documental experimental, el cine expandido, la instalación audiovisual y la performance sonora contemporánea, proponiendo una experiencia perceptiva basada en la escucha, el cuerpo y la emoción. Más que explicar, Invisibles busca hacer sentir.',
        'El proyecto puede presentarse tanto en formato de instalación audiovisual inmersiva como en formato performativo en directo. En su dimensión instalativa, las piezas se reproducen de forma simultánea en distintos dispositivos o proyecciones, permitiendo al espectador recorrer libremente diferentes atmósferas vinculadas a la experiencia de la enfermedad invisible. En el formato performativo, la música se construye en tiempo real mediante loops, instrumentos acústicos y electrónicos, activando el universo audiovisual desde una dimensión viva y profundamente emocional.',
        'Además de su dimensión artística, Invisibles incorpora acciones de mediación y contextos de diálogo orientados a centros educativos, espacios culturales y proyectos sociales, integrando herramientas vinculadas a la escucha activa, la experiencia emocional y la reflexión colectiva.',
        'El proyecto ha sido presentado en teatros, centros culturales y espacios artísticos de España y Portugal, desarrollando formatos híbridos que combinan instalación, performance audiovisual y creación sonora en directo.',
      ],
    },
    gallery: {
      eyebrow: '— imágenes',
      items: [
        {img: '/images/invisibles-3.jpg', alt: 'Invisibles · instalación audiovisual'},
        {img: '/images/invisibles-1.jpg', alt: 'Invisibles · performance audiovisual'},
        {img: '/images/invisibles-2.jpg', alt: 'Invisibles · espacio de escucha'},
      ],
    },
    links: {
      eyebrow: '— material audiovisual',
      groups: [
        {
          label: 'Formato Videoarte',
          items: [
            {text: 'Trailer videoarte', href: 'https://youtu.be/I35ExmFIU8c'},
          ],
        },
        {
          label: 'Formato Performativo',
          items: [
            {text: 'Trailer performativo', href: 'https://www.youtube.com/watch?v=-WrDiiHHN0I'},
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'programación · booking',
      line:    'Para programar Invisibles en tu sala, festival o espacio:',
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
  },

  en: {
    hero: {
      eyebrow: 'artistic projects',
      title:   'Invisibles',
      sub:     'spanish-portuguese artistic project',
    },
    desc: {
      eyebrow: '— the project',
      paragraphs: [
        'Invisibles is a Spanish-Portuguese artistic project that explores the experience of invisible illnesses through video art, live music, audiovisual installation, and first-person testimony.',
        'The proposal emerges from the need to create spaces of listening and visibility around realities that are frequently silenced or misunderstood, using artistic language as a tool for human connection, empathy, and collective reflection.',
        'The project is articulated through a series of audiovisual pieces built from the real accounts of people living with different invisible illnesses. Through the integration of image, sound composition, and testimonial voice, Invisibles develops an immersive experience where the visual, the emotional, and the sonic operate as a single narrative and sensory structure.',
        'The work sits between experimental documentary, expanded cinema, audiovisual installation, and contemporary sound performance, proposing a perceptual experience based on listening, the body, and emotion. More than explaining, Invisibles seeks to make you feel.',
        'The project can be presented both as an immersive audiovisual installation and in a live performative format. In its installation dimension, the pieces play simultaneously on different devices or projections, allowing the viewer to move freely through different atmospheres connected to the experience of invisible illness. In the performative format, the music is built in real time through loops, acoustic and electronic instruments, activating the audiovisual universe from a living and deeply emotional dimension.',
        'Beyond its artistic dimension, Invisibles incorporates mediation actions and dialogue contexts oriented towards educational centres, cultural spaces, and social projects, integrating tools linked to active listening, emotional experience, and collective reflection.',
        'The project has been presented in theatres, cultural centres, and artistic spaces in Spain and Portugal, developing hybrid formats that combine installation, audiovisual performance, and live sound creation.',
      ],
    },
    gallery: {
      eyebrow: '— images',
      items: [
        {img: '/images/invisibles-3.jpg', alt: 'Invisibles · audiovisual installation'},
        {img: '/images/invisibles-1.jpg', alt: 'Invisibles · audiovisual performance'},
        {img: '/images/invisibles-2.jpg', alt: 'Invisibles · listening space'},
      ],
    },
    links: {
      eyebrow: '— audiovisual material',
      groups: [
        {
          label: 'Video Art Format',
          items: [
            {text: 'Video art trailer', href: 'https://youtu.be/I35ExmFIU8c'},
          ],
        },
        {
          label: 'Performative Format',
          items: [
            {text: 'Performative trailer', href: 'https://www.youtube.com/watch?v=-WrDiiHHN0I'},
          ],
        },
      ],
    },
    contact: {
      eyebrow: 'booking · programming',
      line:    'To book Invisibles for your venue, festival or space:',
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
  },
} as const

// ─── Component ────────────────────────────────────────────────────────────────

export function InvisiblesContent() {
  const {lang} = useLang()
  const c = copy[lang]

  const galleryPhotos = c.gallery.items.map(({img, alt}) => ({src: img, alt}))
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const openLightbox  = useCallback((i: number) => setLightboxIdx(i), [])
  const closeLightbox = useCallback(() => setLightboxIdx(null), [])

  return (
    <div className="page" id="invisibles-content">

      {/* ── Hero ── */}
      <section className="about-hero">
        <p className="eyebrow" style={{marginBottom: '1.5rem'}}>{c.hero.eyebrow}</p>
        <h1 className="about-hero__name">{c.hero.title}</h1>
        <p className="about-hero__role">{c.hero.sub}</p>
      </section>

      {/* ── Carousel full-bleed ── */}
      <div style={{width: '100%', lineHeight: 0}}>
        <PhotoCarousel photos={galleryPhotos} aspectRatio="16/9" onOpen={openLightbox} />
      </div>

      {/* ── Texto del proyecto ── */}
      <section className="section">
        <div className="col">
          <p className="eyebrow">{c.desc.eyebrow}</p>
          <div className="prose">
            {c.desc.paragraphs.map((p, i) => (
              <p key={i} style={i === 0 ? {fontStyle: 'italic'} : undefined}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Links audiovisuales ── */}
      <section className="section" style={{borderTop: '1px solid var(--rule-soft)'}}>
        <div className="col">
          <p className="eyebrow">{c.links.eyebrow}</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '36px'}}>
            {c.links.groups.map(({label, items}) => (
              <div key={label}>
                <p style={{
                  fontFamily:    'var(--serif)',
                  fontSize:      '12px',
                  letterSpacing: '0.30em',
                  textTransform: 'lowercase',
                  color:         'var(--ink-faint)',
                  marginBottom:  '14px',
                }}>
                  {label}
                </p>
                <div className="trailers" style={{marginTop: 0}}>
                  {items.map(({text, href}) => (
                    <a
                      key={text}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="trailer"
                    >
                      <span className="trailer__tri" />
                      <span>{text}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contacto / Booking ── */}
      <section className="section section--airy contact">
        <div className="col">
          <span className="rule rule--center" />
          <p className="eyebrow" style={{marginBottom: 0}}>{c.contact.eyebrow}</p>
          <p className="contact__line">{c.contact.line}</p>
          <a className="contact__email" href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
          <a className="contact__email" href="tel:+34669938272">(+34) 669 938 272</a>
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
            fontFamily:     'var(--serif)',
            fontSize:       '0.58rem',
            letterSpacing:  '0.28em',
            textTransform:  'uppercase',
            color:          'var(--ink-faint)',
            textDecoration: 'none',
            transition:     'color 0.3s ease',
            width:          '100%',
            marginTop:      '1rem',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink-soft)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink-faint)' }}
        >
          created by ruijadom.com
        </a>
      </footer>

      {/* ── Photo lightbox overlay ── */}
      {lightboxIdx !== null && (
        <PhotoLightbox
          key={lightboxIdx}
          photos={galleryPhotos}
          startIdx={lightboxIdx}
          closeLabel={lang === 'es' ? 'cerrar' : 'close'}
          onClose={closeLightbox}
        />
      )}

    </div>
  )
}
