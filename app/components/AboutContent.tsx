'use client'

import React, {useState, useEffect, useCallback} from 'react'
import Image from 'next/image'
import {useLang} from '@/app/components/LanguageContext'
import {PhotoCarousel} from '@/app/components/PhotoCarousel'
import {PhotoLightbox} from '@/app/components/PhotoLightbox'

// ─── Content ──────────────────────────────────────────────────────────────────

const copy = {
  es: {
    hero: {
      name:    'Ismael Barredo',
      role:    'músico · compositor · artista visual · musicoterapeuta · educador social',
      eyebrow: 'bio',
    },
    bio: {
      eyebrow: '— bio',
      paragraphs: [
        'Originario de Madrid, del barrio de Hortaleza, Ismael Barredo es un artista multidisciplinar, músico, musicoterapeuta, educador social y creador audiovisual cuyo trabajo explora la relación entre sonido, emoción, e imagen a través de propuestas que transitan entre la música contemporánea, el arte inmersivo y social y la performance audiovisual.',
        'Su práctica artística combina composición musical, improvisación, live looping, handpan, electrónica ambiental y creación visual, desarrollando experiencias donde lo sonoro y lo audiovisual dialogan desde una perspectiva profundamente sensorial y emocional. A través de instrumentos acústicos y electrónicos, construye paisajes sonoros que oscilan entre lo orgánico y lo tecnológico, integrando procesos de creación en tiempo real, escucha profunda y narrativa atmosférica.',
        'Paralelamente, desarrolla proyectos de videoarte e instalaciones inmersivas en las que música, imagen y relato se entrelazan para generar espacios de reflexión y conexión humana. Entre ellos destaca Invisibles, una propuesta audiovisual centrada en la experiencia de las enfermedades invisibles desde una mirada íntima, emocional y sensorial, presentada tanto en formato expositivo como performativo.',
        'Además de sus proyectos escénicos y audiovisuales, compone música para teatro y piezas audiovisuales, desarrollando composiciones originales orientadas a la creación de atmósferas emocionales y narrativas sonoras al servicio de la imagen, el movimiento y la escena.',
        'Su trabajo abarca desde instalaciones audiovisuales y performances inmersivas hasta conciertos contemplativos de handpan, sesiones de ambient electrónica y experiencias colectivas vinculadas al movimiento y la danza consciente, habiendo presentado sus proyectos en teatros, festivales, centros culturales y espacios artísticos de España y Portugal.',
      ],
    },
    gallery: {
      eyebrow: '— galería',
      close:   'cerrar',
    },
    contact: {
      eyebrow: 'contacto · booking',
      line:    'Para conciertos, exposiciones, proyectos o colaboraciones:',
      email:   'ismaelbarredo@gmail.com',
      socials: [
        {label: 'instagram', href: 'https://www.instagram.com/musictomove/'},
        {label: 'youtube',   href: 'https://www.youtube.com/@IsmaelBarredo_MusictoMove'},
        {label: 'facebook',  href: 'https://www.facebook.com/IsmaelBarredoMusictomove'},
      ],
    },
    foot: {
      left:  'Ismael Barredo · 2026',
      right: 'músico · compositor · artista visual',
    },
  },

  en: {
    hero: {
      name:    'Ismael Barredo',
      role:    'musician · composer · visual artist · music therapist · social educator',
      eyebrow: 'bio',
    },
    bio: {
      eyebrow: '— bio',
      paragraphs: [
        "Originally from Madrid's Hortaleza neighbourhood, Ismael Barredo is a multidisciplinary artist, musician, music therapist, social educator, and audiovisual creator whose work explores the relationship between sound, emotion, and image through proposals that move between contemporary music, immersive and social art, and audiovisual performance.",
        'His artistic practice combines musical composition, improvisation, live looping, handpan, ambient electronics, and visual creation, developing experiences where sound and the audiovisual speak from a deeply sensory and emotional perspective. Through acoustic and electronic instruments, he builds soundscapes that oscillate between the organic and the technological, integrating real-time creation processes, deep listening, and atmospheric narrative.',
        'In parallel, he develops video art projects and immersive installations in which music, image, and narrative intertwine to generate spaces of reflection and human connection. Among them, Invisibles stands out — an audiovisual proposal centred on the experience of invisible illnesses from an intimate, emotional, and sensory perspective, presented in both exhibition and performative formats.',
        'Beyond his scenic and audiovisual projects, he composes music for theatre and audiovisual pieces, developing original compositions aimed at creating emotional atmospheres and sonic narratives in service of image, movement, and the stage.',
        'His work ranges from audiovisual installations and immersive performances to contemplative handpan concerts, ambient electronic sessions, and collective experiences connected to movement and conscious dance, having presented his projects in theatres, festivals, cultural centres, and artistic spaces across Spain and Portugal.',
      ],
    },
    gallery: {
      eyebrow: '— gallery',
      close:   'close',
    },
    contact: {
      eyebrow: 'contact · booking',
      line:    'For concerts, exhibitions, projects or collaborations:',
      email:   'ismaelbarredo@gmail.com',
      socials: [
        {label: 'instagram', href: 'https://www.instagram.com/musictomove/'},
        {label: 'youtube',   href: 'https://www.youtube.com/@IsmaelBarredo_MusictoMove'},
        {label: 'facebook',  href: 'https://www.facebook.com/IsmaelBarredoMusictomove'},
      ],
    },
    foot: {
      left:  'Ismael Barredo · 2026',
      right: 'musician · composer · visual artist',
    },
  },
} as const

// ─── Bio photos (language-independent) ───────────────────────────────────────

const BIO_PHOTOS = [
  {src: '/images/bio-1.jpg',         alt: 'Ismael Barredo'},
  {src: '/images/bio-2.jpg',         alt: 'Ismael Barredo'},
  {src: '/images/bio-3.jpg',         alt: 'Ismael Barredo'},
  {src: '/images/bio-4.jpg',         alt: 'Ismael Barredo'},
  {src: '/images/bio-5.jpg',         alt: 'Ismael Barredo'},
  {src: '/images/bio-stage.webp',    alt: 'Ismael Barredo · escena'},
  {src: '/images/bio-performance.webp', alt: 'Ismael Barredo · performance'},
]
// ─── Component ────────────────────────────────────────────────────────────────

export function AboutContent() {
  const {lang} = useLang()
  const c      = copy[lang]

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const openLightbox  = useCallback((i: number) => setLightboxIdx(i), [])
  const closeLightbox = useCallback(() => setLightboxIdx(null), [])

  return (
    <div className="page" id="about-content">

      {/* ── Hero ── */}
      <section className="about-hero" style={{paddingBottom: 'clamp(40px, 5vw, 64px)'}}>
        <p className="eyebrow" style={{marginBottom: '1.5rem'}}>{c.hero.eyebrow}</p>
        <h1 className="about-hero__name">{c.hero.name}</h1>
        <p className="about-hero__role">{c.hero.role}</p>
      </section>

      {/* ── Carousel — restantes fotos ── */}
      <section style={{marginTop: '3px'}}>
        <PhotoCarousel
          photos={BIO_PHOTOS.slice(1)}
          heightVh={65}
          onOpen={i => openLightbox(i + 1)}
        />
      </section>

      {/* ── Bio text ── */}
      <section className="section">
        <div className="col">
          <p className="eyebrow">{c.bio.eyebrow}</p>
          <div className="prose">
            {c.bio.paragraphs.map((p, i) => (
              <p key={i} style={i === 0 ? {fontStyle: 'italic'} : undefined}>{p}</p>
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
          photos={BIO_PHOTOS}
          startIdx={lightboxIdx}
          closeLabel={c.gallery.close}
          onClose={closeLightbox}
        />
      )}

    </div>
  )
}
