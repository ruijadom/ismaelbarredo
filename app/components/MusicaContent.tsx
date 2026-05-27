'use client'

import Image from 'next/image'
import {useLang} from '@/app/components/LanguageContext'

// ─── Content ──────────────────────────────────────────────────────────────────

const copy = {
  es: {
    hero: {
      eyebrow: 'música',
      name:    'Ismael Barredo',
      role:    'handpan · music to move · live looping · ambient · ecstatic dance',
    },
    handpan: {
      eyebrow:  '— handpan',
      title:    'Handpan',
      sub:      'conciertos contemplativos · experiencias sonoras',
      prose: [
        'El proyecto de handpan de Ismael Barredo nace desde la búsqueda de una música íntima, contemplativa y profundamente conectada con la escucha, la emoción y el paisaje.',
        'A través de composiciones originales e improvisación en directo, desarrolla conciertos y experiencias sonoras donde el handpan se convierte en una herramienta de conexión emocional, presencia y sensibilidad compartida. Su enfoque combina silencio, resonancia y creación espontánea, generando atmósferas inmersivas que invitan a la calma, la introspección y la escucha profunda.',
        'Las actuaciones pueden desarrollarse tanto en formato acústico como amplificado, adaptándose a teatros, espacios naturales, centros culturales, eventos, ceremonias, retiros y experiencias inmersivas.',
      ],
      cta:   'ver más ↗',
      href:  'https://youtu.be/mqqt1zcE23o?si=2ZEIpyXcCW3kXxdz',
    },
    musictomove: {
      eyebrow: '— music to move',
      title:   'Music to Move',
      sub:     'electrónica orgánica · live looping · ambient · ecstatic dance',
      prose: [
        'Music to Move es el proyecto musical y performativo de Ismael Barredo, centrado en la exploración de experiencias inmersivas a través de la música electrónica orgánica, el ambient, el live looping y la creación sonora en tiempo real.',
        'El proyecto combina instrumentos acústicos y electrónicos, sintetizadores, loops, texturas atmosféricas y construcción progresiva de capas sonoras para desarrollar sesiones que transitan entre la escucha inmersiva, la narrativa sonora y el movimiento colectivo.',
        'Bajo el nombre de Music to Move conviven diferentes formatos, desde actuaciones de ambient y live looping hasta sesiones de Ecstatic Dance y propuestas híbridas donde música, visuales y performance se integran dentro de una misma experiencia audiovisual y espacial.',
      ],
    },
    liveloop: {
      eyebrow: '— live looping · música ambient',
      title:   'Live Looping · Ambient',
      sub:     'live looping · electrónica orgánica',
      prose: [
        'El formato de live looping y música ambient se centra en la creación sonora en directo mediante la construcción progresiva de capas, texturas y secuencias musicales en tiempo real.',
        'A través de instrumentos acústicos, sintetizadores, guitarra y procesamiento electrónico, cada sesión evoluciona de forma orgánica, desarrollando paisajes sonoros inmersivos entre ambient contemporáneo, downtempo y electrónica orgánica.',
        'La propuesta puede integrar visuales sincronizados con la música para ampliar el carácter espacial y performativo de la experiencia.',
      ],
      cta:   'ver más ↗',
      href:  'https://youtube.com/playlist?list=PLGd4ULnfIszWfs9jrn67DJhK1mo4UIeNG&si=ZBJtdPJfemTqkgWD',
    },
    ecstatic: {
      eyebrow: '— music to move',
      title:   'Ecstatic Dance',
      sub:     'cuerpo en escucha · movimiento libre',
      prose: [
        'Estatic Dance es una propuesta orientada al movimiento libre y la construcción de recorridos musicales progresivos a través de la electrónica orgánica, tribal, melodic y ambient.',
        'Las sesiones alternan diferentes intensidades rítmicas y atmosféricas, desarrollando una narrativa sonora pensada para acompañar la experiencia corporal y el movimiento colectivo.',
        'La propuesta puede incorporar elementos de live looping, instrumentos orgánicos y visuales en directo como parte de la experiencia inmersiva.',
      ],
      cta:   'ver más ↗',
      href:  'https://youtube.com/playlist?list=PLigjdb67OBM8tupNGErXxU_Z263LIe4IV&si=WmbcVBxspBvcqOqL',
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
      right: 'música · lo que suena, también sana',
    },
  },
  en: {
    hero: {
      eyebrow: 'music',
      name:    'Ismael Barredo',
      role:    'handpan · music to move · live looping · ambient · ecstatic dance',
    },
    handpan: {
      eyebrow:  '— handpan',
      title:    'Handpan',
      sub:      'contemplative concerts · sonic experiences',
      prose: [
        "Ismael Barredo's handpan project emerges from a search for intimate, contemplative music deeply connected to listening, emotion, and landscape.",
        'Through original compositions and live improvisation, he develops concerts and sonic experiences where the handpan becomes a tool for emotional connection, presence, and shared sensitivity. His approach combines silence, resonance, and spontaneous creation, generating immersive atmospheres that invite calm, introspection, and deep listening.',
        'Performances can be developed in both acoustic and amplified formats, adapting to theatres, natural spaces, cultural centres, events, ceremonies, retreats, and immersive experiences.',
      ],
      cta:   'watch more ↗',
      href:  'https://youtu.be/mqqt1zcE23o?si=2ZEIpyXcCW3kXxdz',
    },
    musictomove: {
      eyebrow: '— music to move',
      title:   'Music to Move',
      sub:     'organic electronics · live looping · ambient · ecstatic dance',
      prose: [
        "Music to Move is Ismael Barredo's musical and performative project, focused on the exploration of immersive experiences through organic electronic music, ambient, live looping, and real-time sound creation.",
        'The project combines acoustic and electronic instruments, synthesisers, loops, atmospheric textures, and the progressive construction of sonic layers to develop sessions that move between immersive listening, sonic narrative, and collective movement.',
        'Under the name Music to Move, different formats coexist — from ambient and live looping performances to Ecstatic Dance sessions and hybrid proposals where music, visuals, and performance integrate into a single audiovisual and spatial experience.',
      ],
    },
    liveloop: {
      eyebrow: '— live looping · ambient music',
      title:   'Live Looping · Ambient',
      sub:     'live looping · organic electronics',
      prose: [
        'The live looping and ambient music format focuses on live sound creation through the progressive building of layers, textures, and musical sequences in real time.',
        'Through acoustic instruments, synthesisers, guitar, and electronic processing, each session evolves organically, developing immersive soundscapes between contemporary ambient, downtempo, and organic electronics.',
        'The proposal can integrate visuals synchronised with the music to expand the spatial and performative character of the experience.',
      ],
      cta:   'watch more ↗',
      href:  'https://youtube.com/playlist?list=PLGd4ULnfIszWfs9jrn67DJhK1mo4UIeNG&si=ZBJtdPJfemTqkgWD',
    },
    ecstatic: {
      eyebrow: '— music to move',
      title:   'Ecstatic Dance',
      sub:     'body listening · free movement',
      prose: [
        'Ecstatic Dance is a proposal oriented towards free movement and the construction of progressive musical journeys through organic, tribal, melodic, and ambient electronics.',
        'Sessions alternate between different rhythmic and atmospheric intensities, developing a sonic narrative designed to accompany the bodily experience and collective movement.',
        'The proposal can incorporate live looping elements, organic instruments, and live visuals as part of the immersive experience.',
      ],
      cta:   'watch more ↗',
      href:  'https://youtube.com/playlist?list=PLigjdb67OBM8tupNGErXxU_Z263LIe4IV&si=WmbcVBxspBvcqOqL',
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
      right: 'music · what sounds, also heals',
    },
  },
} as const

// ─── Música Section Block ────────────────────────────────────────────────────

interface SectionBlockProps {
  eyebrow:  string
  title:    string
  sub:      string
  prose:    readonly string[]
  cta?:     string
  href?:    string
  img:      string
  imgAlt:   string
  reverse?: boolean
}

function SectionBlock({eyebrow, title, sub, prose, cta, href, img, imgAlt, reverse}: SectionBlockProps) {
  return (
    <section className="section musica-block" style={{borderTop: '1px solid var(--rule-soft)'}}>
      <div
        className="col--wide"
        style={{
          display:       'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap:           'clamp(40px, 6vw, 96px)',
          alignItems:    'center',
          direction:     reverse ? 'rtl' : 'ltr',
        }}
      >
        {/* Image */}
        <div style={{direction: 'ltr', position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#1a1a1a'}}>
          <Image
            src={img}
            alt={imgAlt}
            fill
            style={{objectFit: 'cover', opacity: 0.88}}
            sizes="(max-width: 760px) 100vw, 48vw"
          />
        </div>

        {/* Text */}
        <div style={{direction: 'ltr'}}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 style={{
            fontFamily:    'var(--serif-display)',
            fontWeight:    400,
            fontSize:      'clamp(28px, 3.5vw, 48px)',
            lineHeight:    1.15,
            letterSpacing: '-0.01em',
            color:         'var(--ink)',
            margin:        '0 0 8px',
          }}>{title}</h2>
          <p style={{
            fontFamily:    'var(--serif)',
            fontSize:      '13px',
            letterSpacing: '0.22em',
            textTransform: 'lowercase',
            color:         'var(--ink-faint)',
            margin:        '0 0 32px',
          }}>{sub}</p>
          <div className="prose">
            {prose.map((p, i) => (
              <p key={i}>{i === 0 ? <em>{p}</em> : p}</p>
            ))}
          </div>
          {cta && href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        'inline-block',
                marginTop:      '28px',
                fontFamily:     'var(--serif)',
                fontSize:       '13px',
                letterSpacing:  '0.28em',
                textTransform:  'lowercase',
                color:          'var(--ink-soft)',
                textDecoration: 'none',
                borderBottom:   '1px solid var(--rule)',
                paddingBottom:  '2px',
                transition:     'color 200ms ease, border-color 200ms ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--ink)'
                el.style.borderColor = 'var(--ink)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'var(--ink-soft)'
                el.style.borderColor = 'var(--rule)'
              }}
            >{cta}</a>
          )}
        </div>
      </div>

      {/* Mobile stacked layout */}
      <style>{`
        @media (max-width: 720px) {
          .musica-block .col--wide {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
          }
        }
      `}</style>
    </section>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MusicaContent() {
  const {lang} = useLang()
  const c      = copy[lang]

  return (
    <div className="page" id="musica-content">

      {/* ── Hero ── */}
      <section className="about-hero">
        <p className="eyebrow" style={{marginBottom: '1.5rem'}}>{c.hero.eyebrow}</p>
        <h1 className="about-hero__name">{c.hero.name}</h1>
        <p className="about-hero__role">{c.hero.role}</p>
      </section>

      {/* ── Handpan ── */}
      <SectionBlock
        eyebrow={c.handpan.eyebrow}
        title={c.handpan.title}
        sub={c.handpan.sub}
        prose={c.handpan.prose}
        cta={c.handpan.cta}
        href={c.handpan.href}
        img="/images/handpan-1.webp"
        imgAlt="Ismael Barredo · Handpan"
        reverse={false}
      />

      {/* ── Music to Move ── */}
      <SectionBlock
        eyebrow={c.musictomove.eyebrow}
        title={c.musictomove.title}
        sub={c.musictomove.sub}
        prose={c.musictomove.prose}
        img="/images/live-looping-2.webp"
        imgAlt="Ismael Barredo · Music to Move"
        reverse={true}
      />

      {/* ── Live Looping / Ambient ── */}
      <SectionBlock
        eyebrow={c.liveloop.eyebrow}
        title={c.liveloop.title}
        sub={c.liveloop.sub}
        prose={c.liveloop.prose}
        cta={c.liveloop.cta}
        href={c.liveloop.href}
        img="/images/mtm-live-1.jpg"
        imgAlt="Ismael Barredo · Live Looping"
        reverse={false}
      />

      {/* ── Ecstatic Dance ── */}
      <SectionBlock
        eyebrow={c.ecstatic.eyebrow}
        title={c.ecstatic.title}
        sub={c.ecstatic.sub}
        prose={c.ecstatic.prose}
        cta={c.ecstatic.cta}
        href={c.ecstatic.href}
        img="/images/mtm-ecstatic-1.jpg"
        imgAlt="Ismael Barredo · Ecstatic Dance"
        reverse={true}
      />

      {/* ── Contacto ── */}
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

    </div>
  )
}
