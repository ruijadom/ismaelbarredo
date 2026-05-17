'use client'

import Image from 'next/image'
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
      title:    'Proyectos',
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
      title:    'Projects',
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
  },
} as const

// ─── Component ────────────────────────────────────────────────────────────────

export function AboutContent() {
  const {lang} = useLang()
  const c = copy[lang]

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
          src="/images/bio-stage.jpg"
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
            {c.projects.rows.map(({num, name, sub, desc, href, arrow}) => {
              const Tag = href ? 'a' : 'div'
              const linkProps = href
                ? {href, target: href.startsWith('http') ? '_blank' : undefined, rel: href.startsWith('http') ? 'noopener noreferrer' : undefined}
                : {}
              return (
                <Tag
                  key={num}
                  {...(linkProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                  className={'project-row' + (href ? ' project-row--link' : '')}
                  style={{textDecoration: 'none', color: 'inherit'}}
                >
                  <span className="project-row__num">{num}</span>
                  <div>
                    <p className="project-row__name">
                      {name} <em>{sub}</em>
                    </p>
                  </div>
                  <p className="project-row__desc">{desc}</p>
                  {arrow && <span className="project-row__arrow">{arrow}</span>}
                </Tag>
              )
            })}
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
      </footer>

    </div>
  )
}
