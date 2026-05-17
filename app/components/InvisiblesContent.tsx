'use client'

import Image from 'next/image'
import {useLang} from '@/app/components/LanguageContext'

// ─── Content ──────────────────────────────────────────────────────────────────

const copy = {
  es: {
    manifesto: {
      eyebrow: 'invisibles · proyecto artístico',
      lines:   ['Un proyecto que ', 'no se explica.', 'Se escucha, se respira,', 'se siente en el cuerpo.'],
    },
    desc: {
      eyebrow: '— el proyecto',
      lede:    'Un proyecto artístico hispano-portugués que explora la experiencia de las enfermedades invisibles a través del videoarte, la música en directo, la instalación audiovisual y el testimonio en primera persona.',
      prose:   [
        'La obra se sitúa entre el documental experimental, el cine expandido y la performance sonora contemporánea, proponiendo una experiencia perceptiva basada en la escucha, el cuerpo y la emoción.',
        'Más que explicar, Invisibles busca hacer sentir aquello que el lenguaje suele dejar fuera: el dolor que no se ve, la fatiga que no se nombra, la presencia silenciosa de quienes habitan un cuerpo herido.',
      ],
    },
    gallery: {
      eyebrow: 'material audiovisual',
      items: [
        {caption: 'Trailer videoarte',    num: '01', href: 'https://youtu.be/I35ExmFIU8c',                       img: '/images/invisibles-1.jpg'},
        {caption: 'Trailer performativo', num: '02', href: 'https://www.youtube.com/watch?v=-WrDiiHHN0I',         img: '/images/invisibles-2.jpg'},
      ],
      links: [
        {label: 'ver trailer videoarte',    href: 'https://youtu.be/I35ExmFIU8c'},
        {label: 'ver trailer performativo', href: 'https://www.youtube.com/watch?v=-WrDiiHHN0I'},
        {label: 'proyecto completo',        href: 'https://youtube.com/playlist?list=PLigjdb67OBM8Tv_7iZkoEdnZ69ulqN8J-&si=dMf9DRhr6jAZgpnt'},
      ],
    },
    ficha: {
      eyebrow: '— ficha técnica',
      rows: [
        {dt: 'dirección',       dd: 'Ismael Barredo'},
        {dt: 'música original', dd: 'Ismael Barredo · handpan, electrónica, paisajes sonoros'},
        {dt: 'videoarte',       dd: 'Colaboración con artistas visuales hispano-portugueses'},
        {dt: 'duración',        dd: '60 minutos'},
        {dt: 'formato',         dd: 'Performance audiovisual · instalación adaptable'},
        {dt: 'idioma',          dd: 'Español, portugués, gallego'},
        {dt: 'público',         dd: 'Recomendado a partir de 16 años'},
        {dt: 'territorio',      dd: 'España · Portugal'},
      ],
    },
    agenda: {
      eyebrow: '— próximas fechas',
      rows: [
        {date: '11 may 2026', venue: 'Auditorio Municipal',          city: 'Pontevedra · estreno', cta: 'finalizado', past: true,  href: ''},
        {date: '14 jun 2026', venue: 'Teatro Principal',             city: 'Pontevedra, Galicia',  cta: 'entradas →',  past: false, href: ''},
        {date: '02 jul 2026', venue: 'Festival Cinhomenagem',        city: 'Porto, Portugal',      cta: 'entradas →',  past: false, href: ''},
        {date: '28 sep 2026', venue: 'Centro Cultural Conde Duque',  city: 'Madrid, España',       cta: 'próximamente',past: false, href: ''},
      ],
    },
    contact: {
      eyebrow: '— programación · booking',
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
    manifesto: {
      eyebrow: 'invisibles · artistic project',
      lines:   ['A project that ', 'cannot be explained.', 'It is listened to, breathed,', 'felt in the body.'],
    },
    desc: {
      eyebrow: '— the project',
      lede:    'A Spanish-Portuguese artistic project exploring the experience of invisible illnesses through video art, live music, audiovisual installation, and first-person testimony.',
      prose:   [
        'The work sits between experimental documentary, expanded cinema, and contemporary sound performance — proposing a perceptual experience based on listening, the body, and emotion.',
        'More than explaining, Invisibles seeks to make you feel what language usually leaves out: pain that cannot be seen, fatigue that has no name, the silent presence of those who inhabit a wounded body.',
      ],
    },
    gallery: {
      eyebrow: 'audiovisual material',
      items: [
        {caption: 'Video art trailer',    num: '01', href: 'https://youtu.be/I35ExmFIU8c',                       img: '/images/invisibles-1.jpg'},
        {caption: 'Performative trailer', num: '02', href: 'https://www.youtube.com/watch?v=-WrDiiHHN0I',         img: '/images/invisibles-2.jpg'},
      ],
      links: [
        {label: 'watch video art trailer',    href: 'https://youtu.be/I35ExmFIU8c'},
        {label: 'watch performative trailer', href: 'https://www.youtube.com/watch?v=-WrDiiHHN0I'},
        {label: 'full project',               href: 'https://youtube.com/playlist?list=PLigjdb67OBM8Tv_7iZkoEdnZ69ulqN8J-&si=dMf9DRhr6jAZgpnt'},
      ],
    },
    ficha: {
      eyebrow: '— technical sheet',
      rows: [
        {dt: 'direction',        dd: 'Ismael Barredo'},
        {dt: 'original music',   dd: 'Ismael Barredo · handpan, electronics, soundscapes'},
        {dt: 'video art',        dd: 'Collaboration with Spanish-Portuguese visual artists'},
        {dt: 'duration',         dd: '60 minutes'},
        {dt: 'format',           dd: 'Audiovisual performance · adaptable installation'},
        {dt: 'language',         dd: 'Spanish, Portuguese, Galician'},
        {dt: 'audience',         dd: 'Recommended 16+'},
        {dt: 'territory',        dd: 'Spain · Portugal'},
      ],
    },
    agenda: {
      eyebrow: '— upcoming dates',
      rows: [
        {date: '11 may 2026', venue: 'Auditorio Municipal',          city: 'Pontevedra · premiere', cta: 'finished',    past: true,  href: ''},
        {date: '14 jun 2026', venue: 'Teatro Principal',             city: 'Pontevedra, Galicia',   cta: 'tickets →',   past: false, href: ''},
        {date: '02 jul 2026', venue: 'Festival Cinhomenagem',        city: 'Porto, Portugal',       cta: 'tickets →',   past: false, href: ''},
        {date: '28 sep 2026', venue: 'Centro Cultural Conde Duque',  city: 'Madrid, Spain',         cta: 'coming soon', past: false, href: ''},
      ],
    },
    contact: {
      eyebrow: '— booking · programming',
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

  return (
    <div className="page" id="invisibles-content">

      {/* ── Manifesto ── */}
      <section className="section section--airy">
        <div className="col">
          <p className="eyebrow">{c.manifesto.eyebrow}</p>
          <h2 className="manifesto">
            {c.manifesto.lines[0]}<em>{c.manifesto.lines[1]}</em><br />
            {c.manifesto.lines[2]}<br />
            {c.manifesto.lines[3]}
          </h2>
        </div>
      </section>

      {/* ── Descripción ── */}
      <section className="section">
        <div className="col">
          <p className="eyebrow">{c.desc.eyebrow}</p>
          <p className="lede">{c.desc.lede}</p>
          <div className="prose">
            {c.desc.prose.map((p, i) => (
              <p key={i}>{i === 0 ? <em>{p}</em> : p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galería audiovisual ── */}
      <section className="section section--tight">
        <div className="col--full">
          <p className="eyebrow" style={{textAlign: 'center', marginBottom: 48}}>{c.gallery.eyebrow}</p>

          <div className="gallery gallery--wide">
            {c.gallery.items.map(({caption, num, href, img}) => (
              <a
                key={num}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="gallery-item"
                style={{display: 'block', color: 'inherit', cursor: 'pointer'}}
              >
                <div style={{position: 'relative', width: '100%', aspectRatio: '16/10', background: '#1a1a1a', overflow: 'hidden'}}>
                  <Image
                    src={img}
                    alt={caption}
                    fill
                    style={{objectFit: 'cover', opacity: 0.85}}
                    sizes="(max-width: 760px) 100vw, 55vw"
                  />
                  <div className="play-overlay">
                    <div className="play-overlay__circle">▶</div>
                  </div>
                </div>
                <div className="gallery-item__caption">
                  <span>{caption}</span>
                  <span className="gallery-item__num">{num}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="trailers">
            {c.gallery.links.map(({label, href}) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="trailer"
              >
                <span className="trailer__tri" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instalación — full-bleed image ── */}
      {/* <section className="section section--tight">
        <div className="col--full">
          <div style={{position: 'relative', width: '100%', aspectRatio: '21/9', background: '#1a1a1a', overflow: 'hidden'}}>
            <Image
              src="/images/invisibles-1.jpg"
              alt="Invisibles · instalación audiovisual"
              fill
              style={{objectFit: 'cover'}}
              sizes="100vw"
            />
          </div>
          <p style={{
            marginTop: 18,
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--ink-soft)',
            textAlign: 'right',
            letterSpacing: '0.02em',
            fontFamily: 'var(--serif)',
          }}>
            Invisibles · instalación audiovisual
          </p>
        </div>
      </section> */}

      {/* ── Ficha técnica ── */}
      <section className="section">
        <div className="col">
          <p className="eyebrow">{c.ficha.eyebrow}</p>
          <dl className="ficha">
            {c.ficha.rows.map(({dt, dd}) => (
              <>
                <dt key={`dt-${dt}`}>{dt}</dt>
                <dd key={`dd-${dt}`}>{dd}</dd>
              </>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Agenda ── */}
      {/* <section className="section">
        <div className="col">
          <p className="eyebrow">{c.agenda.eyebrow}</p>
          <div className="agenda">
            {c.agenda.rows.map(({date, venue, city, cta, past, href}) => (
              <div key={date + venue} className="agenda-row">
                <span className="agenda-date">{date}</span>
                <span className="agenda-venue">{venue}</span>
                <span className="agenda-city">{city}</span>
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className={'agenda-cta' + (past ? ' agenda-cta--past' : '')}>{cta}</a>
                ) : (
                  <span className={'agenda-cta' + (past ? ' agenda-cta--past' : '')}>{cta}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Contacto / Booking ── */}
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
      </footer>

    </div>
  )
}
