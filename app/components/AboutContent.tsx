'use client'

import Image from 'next/image'
import {useLang} from '@/app/components/LanguageContext'

// ─── Content ──────────────────────────────────────────────────────────────────

const copy = {
  es: {
    role: 'músico · compositor · live looper · musicoterapeuta · educador social',
    sections: {
      bio: {
        label: 'bio',
        paragraphs: [
          'Originario de Madrid, del barrio de Hortaleza, Ismael Barredo es un artista multidisciplinar, músico, musicoterapeuta, educador social y creador audiovisual cuyo trabajo explora la relación entre sonido, emoción e imagen a través de propuestas que transitan entre la música contemporánea, el arte inmersivo y social, y la performance audiovisual.',
          'Su práctica artística combina composición musical, improvisación, live looping, handpan, electrónica ambiental y creación visual, desarrollando experiencias donde lo sonoro y lo audiovisual dialogan desde una perspectiva profundamente sensorial y emocional. A través de instrumentos acústicos y electrónicos, construye paisajes sonoros que oscilan entre lo orgánico y lo tecnológico, integrando procesos de creación en tiempo real, escucha profunda y narrativa atmosférica.',
          'Además de sus proyectos escénicos y audiovisuales, compone música para teatro y piezas audiovisuales, desarrollando composiciones originales orientadas a la creación de atmósferas emocionales y narrativas sonoras al servicio de la imagen, el movimiento y la escena.',
          'Su trabajo abarca desde instalaciones audiovisuales y performances inmersivas hasta conciertos contemplativos de handpan, sesiones de ambient electrónica y experiencias colectivas vinculadas al movimiento y la danza consciente, habiendo presentado sus proyectos en teatros, festivales, centros culturales y espacios artísticos de España y Portugal.',
        ],
      },
      handpan: {
        label: 'handpan',
        paragraphs: [
          'El proyecto de handpan de Ismael Barredo nace desde la búsqueda de una música íntima, contemplativa y profundamente conectada con la escucha, la emoción y el paisaje.',
          'A través de composiciones originales e improvisación en directo, desarrolla conciertos y experiencias sonoras donde el handpan se convierte en una herramienta de conexión emocional, presencia y sensibilidad compartida. Su enfoque combina silencio, resonancia y creación espontánea, generando atmósferas inmersivas que invitan a la calma, la introspección y la escucha profunda.',
          'Las actuaciones pueden desarrollarse tanto en formato acústico como amplificado, adaptándose a teatros, espacios naturales, centros culturales, eventos, ceremonias, retiros y experiencias inmersivas.',
        ],
        links: [{label: 'ver vídeo', href: 'https://youtu.be/mqqt1zcE23o?si=2ZEIpyXcCW3kXxdz'}],
        images: [
          {src: '/images/handpan-1.jpg', alt: 'Ismael Barredo — handpan'},
          {src: '/images/handpan-2.jpg', alt: 'Ismael Barredo — handpan en directo'},
          {src: '/images/handpan-3.jpg', alt: 'Ismael Barredo — concierto handpan'},
        ],
      },
      musicToMove: {
        label: 'music to move',
        intro: 'Music to Move es el proyecto musical y performativo de Ismael Barredo, centrado en la exploración de experiencias inmersivas a través de la música electrónica orgánica, el ambient, el live looping y la creación sonora en tiempo real.',
        subSections: [
          {
            label: 'live looping — música ambient',
            paragraphs: [
              'El formato de live looping y música ambient se centra en la creación sonora en directo mediante la construcción progresiva de capas, texturas y secuencias musicales en tiempo real. A través de instrumentos acústicos, sintetizadores, guitarra y procesamiento electrónico, cada sesión evoluciona de forma orgánica, desarrollando paisajes sonoros inmersivos entre ambient contemporáneo, downtempo y electrónica orgánica.',
              'La propuesta puede integrar visuales sincronizados con la música para ampliar el carácter espacial y performativo de la experiencia.',
            ],
            links: [{label: 'ver playlist', href: 'https://youtube.com/playlist?list=PLGd4ULnfIszWfs9jrn67DJhK1mo4UIeNG&si=ZBJtdPJfemTqkgWD'}],
            images: [
              {src: '/images/live-looping-1.jpg', alt: 'Ismael Barredo — live looping'},
              {src: '/images/live-looping-2.jpg', alt: 'Ismael Barredo — ambient set'},
            ],
          },
          {
            label: 'ecstatic dance',
            paragraphs: [
              'Ecstatic Dance es una propuesta orientada al movimiento libre y la construcción de recorridos musicales progresivos a través de la electrónica orgánica, tribal, melodic y ambient.',
              'Las sesiones alternan diferentes intensidades rítmicas y atmosféricas, desarrollando una narrativa sonora pensada para acompañar la experiencia corporal y el movimiento colectivo. La propuesta puede incorporar elementos de live looping, instrumentos orgánicos y visuales en directo.',
            ],
            links: [],
            images: [
              {src: '/images/ecstatic-dance-1.jpg', alt: 'Ecstatic Dance — sesión'},
            ],
          },
        ],
      },
      contact: {
        label: 'contacto',
        links: [
          {label: 'ismaelbarredo@gmail.com', href: 'mailto:ismaelbarredo@gmail.com'},
          {label: '+34 669 938 272',          href: 'tel:+34669938272'},
          {label: 'whatsapp',                 href: 'https://wa.me/34669938272'},
        ],
        social: [
          {label: 'instagram', href: 'https://www.instagram.com/musictomove/'},
          {label: 'youtube',   href: 'https://www.youtube.com/@IsmaelBarredo_MusictoMove'},
          {label: 'facebook',  href: 'https://www.facebook.com/IsmaelBarredoMusictomove'},
        ],
      },
    },
  },

  en: {
    role: 'musician · composer · live looper · music therapist · social educator',
    sections: {
      bio: {
        label: 'bio',
        paragraphs: [
          "From Madrid's Hortaleza neighbourhood, Ismael Barredo is a multidisciplinary artist, musician, music therapist, social educator, and audiovisual creator whose work explores the relationship between sound, emotion, and image through proposals that move between contemporary music, immersive and social art, and audiovisual performance.",
          'His artistic practice combines musical composition, improvisation, live looping, handpan, ambient electronics, and visual creation, developing experiences where sound and the audiovisual speak from a deeply sensory and emotional perspective. Through acoustic and electronic instruments, he builds soundscapes that oscillate between the organic and the technological, integrating real-time creation processes, deep listening, and atmospheric narrative.',
          'Alongside his scenic and audiovisual projects, he composes music for theatre and audiovisual pieces, developing original compositions aimed at creating emotional atmospheres and sonic narratives in service of image, movement, and the stage.',
          'His work spans audiovisual installations and immersive performances to contemplative handpan concerts, electronic ambient sessions, and collective experiences linked to conscious movement and dance, having presented his projects in theatres, festivals, cultural centres, and artistic spaces across Spain and Portugal.',
        ],
      },
      handpan: {
        label: 'handpan',
        paragraphs: [
          "Ismael Barredo's handpan project is born from the search for an intimate, contemplative music deeply connected with listening, emotion, and landscape.",
          'Through original compositions and live improvisation, he develops concerts and sonic experiences where the handpan becomes a tool for emotional connection, presence, and shared sensitivity. His approach combines silence, resonance, and spontaneous creation, generating immersive atmospheres that invite calm, introspection, and deep listening.',
          'Performances can take place in acoustic or amplified format, adapting to theatres, natural spaces, cultural centres, events, ceremonies, retreats, and immersive experiences.',
        ],
        links: [{label: 'watch video', href: 'https://youtu.be/mqqt1zcE23o?si=2ZEIpyXcCW3kXxdz'}],
        images: [
          {src: '/images/handpan-1.jpg', alt: 'Ismael Barredo — handpan'},
          {src: '/images/handpan-2.jpg', alt: 'Ismael Barredo — handpan live'},
          {src: '/images/handpan-3.jpg', alt: 'Ismael Barredo — handpan concert'},
        ],
      },
      musicToMove: {
        label: 'music to move',
        intro: "Music to Move is Ismael Barredo's musical and performative project, focused on exploring immersive experiences through organic electronic music, ambient, live looping, and real-time sound creation.",
        subSections: [
          {
            label: 'live looping — ambient music',
            paragraphs: [
              'The live looping and ambient music format focuses on live sound creation through the progressive layering of textures and musical sequences in real time. Through acoustic instruments, synthesizers, guitar, and electronic processing, each session evolves organically, developing immersive soundscapes between contemporary ambient, downtempo, and organic electronics.',
              'The proposal can integrate visuals synchronised with the music to expand the spatial and performative character of the experience.',
            ],
            links: [{label: 'watch playlist', href: 'https://youtube.com/playlist?list=PLGd4ULnfIszWfs9jrn67DJhK1mo4UIeNG&si=ZBJtdPJfemTqkgWD'}],
            images: [
              {src: '/images/live-looping-1.jpg', alt: 'Ismael Barredo — live looping'},
              {src: '/images/live-looping-2.jpg', alt: 'Ismael Barredo — ambient set'},
            ],
          },
          {
            label: 'ecstatic dance',
            paragraphs: [
              'Ecstatic Dance is a proposal oriented towards free movement and the construction of progressive musical journeys through organic, tribal, melodic, and ambient electronics.',
              'The sessions alternate different rhythmic and atmospheric intensities, developing a sonic narrative designed to accompany bodily experience and collective movement. The proposal can incorporate live looping, organic instruments, and live visuals.',
            ],
            links: [],
            images: [
              {src: '/images/ecstatic-dance-1.jpg', alt: 'Ecstatic Dance — session'},
            ],
          },
        ],
      },
      contact: {
        label: 'contact',
        links: [
          {label: 'ismaelbarredo@gmail.com', href: 'mailto:ismaelbarredo@gmail.com'},
          {label: '+34 669 938 272',          href: 'tel:+34669938272'},
          {label: 'whatsapp',                 href: 'https://wa.me/34669938272'},
        ],
        social: [
          {label: 'instagram', href: 'https://www.instagram.com/musictomove/'},
          {label: 'youtube',   href: 'https://www.youtube.com/@IsmaelBarredo_MusictoMove'},
          {label: 'facebook',  href: 'https://www.facebook.com/IsmaelBarredoMusictomove'},
        ],
      },
    },
  },
} as const

// ─── Shared style tokens ──────────────────────────────────────────────────────

const serifSm   = {fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.62rem', letterSpacing: '0.46em', textTransform: 'uppercase' as const, color: 'rgba(90,76,62,0.38)'}
const serifBody = {fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(0.88rem,1.5vw,1.05rem)', lineHeight: 1.95, color: 'rgba(50,38,28,0.72)'}
const linkStyle = {fontFamily: 'Georgia, serif', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: 'rgba(90,76,62,0.45)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.3s ease'}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Divider() {
  return (
    <div style={{width: '2rem', height: '1px', background: 'rgba(90,76,62,0.15)', margin: '3.5rem 0'}} />
  )
}

function ImageGrid({images, cols = 2}: {images: readonly {src: string; alt: string}[], cols?: number}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: '0.75rem',
      marginTop: '2rem',
    }}>
      {images.map(({src, alt}) => (
        <div key={src} style={{position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '2px', background: 'rgba(90,76,62,0.05)'}}>
          <Image src={src} alt={alt} fill style={{objectFit: 'cover'}} sizes="(max-width: 640px) 50vw, 320px" />
        </div>
      ))}
    </div>
  )
}

function ExtLink({href, label}: {href: string; label: string}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(60,46,34,0.9)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(90,76,62,0.45)' }}
    >
      <span style={{opacity: 0.5, fontSize: '0.68rem'}}>▶</span>
      {label}
    </a>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AboutContent() {
  const {lang} = useLang()
  const c = copy[lang]
  const s = c.sections

  return (
    <main style={{
      minHeight:     '100vh',
      background:    '#faf8f5',
      padding:       'clamp(6rem, 12vw, 10rem) clamp(1.5rem, 6vw, 2.5rem) 6rem',
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
    }}>

      {/* ── Name + photo ── */}
      <p style={{...serifSm, marginBottom: '2.5rem'}}>ismael barredo</p>

      {/* Portrait */}
      <div style={{
        position:     'relative',
        width:        'clamp(140px, 22vw, 200px)',
        aspectRatio:  '3/4',
        overflow:     'hidden',
        borderRadius: '2px',
        marginBottom: '2rem',
        background:   'rgba(90,76,62,0.05)',
      }}>
        <Image
          src="/images/ismael-bio.png"
          alt="Ismael Barredo"
          fill
          style={{objectFit: 'cover', objectPosition: 'top'}}
          sizes="(max-width: 640px) 40vw, 200px"
          priority
        />
      </div>

      <p style={{...serifBody, fontStyle: 'italic', color: 'rgba(50,38,28,0.42)', textAlign: 'center', maxWidth: '22rem', marginBottom: '0.5rem'}}>
        {c.role}
      </p>

      <Divider />

      {/* ── Bio ── */}
      <section style={{width: '100%', maxWidth: '640px', marginBottom: '3rem'}}>
        <p style={{...serifSm, marginBottom: '1.5rem'}}>{s.bio.label}</p>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
          {s.bio.paragraphs.map((p, i) => (
            <p key={i} style={serifBody}>{p}</p>
          ))}
        </div>
        {/* Performance photo */}
        <div style={{
          position:     'relative',
          width:        '100%',
          aspectRatio:  '16/9',
          overflow:     'hidden',
          borderRadius: '2px',
          marginTop:    '2rem',
          background:   'rgba(90,76,62,0.05)',
        }}>
          <Image
            src="/images/bio-performance.jpg"
            alt="Ismael Barredo — performance"
            fill
            style={{objectFit: 'cover'}}
            sizes="(max-width: 640px) 100vw, 640px"
          />
        </div>
      </section>

      <Divider />

      {/* ── Handpan ── */}
      <section style={{width: '100%', maxWidth: '640px', marginBottom: '3rem'}}>
        <p style={{...serifSm, marginBottom: '1.5rem'}}>{s.handpan.label}</p>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
          {s.handpan.paragraphs.map((p, i) => (
            <p key={i} style={serifBody}>{p}</p>
          ))}
        </div>

        <ImageGrid images={s.handpan.images} cols={3} />

        {s.handpan.links.length > 0 && (
          <div style={{display: 'flex', gap: '2rem', marginTop: '1.5rem'}}>
            {s.handpan.links.map(l => <ExtLink key={l.href} href={l.href} label={l.label} />)}
          </div>
        )}
      </section>

      <Divider />

      {/* ── Music to Move ── */}
      <section style={{width: '100%', maxWidth: '640px', marginBottom: '3rem'}}>
        <p style={{...serifSm, marginBottom: '1.5rem'}}>{s.musicToMove.label}</p>
        <p style={serifBody}>{s.musicToMove.intro}</p>

        {s.musicToMove.subSections.map((sub) => (
          <div key={sub.label} style={{marginTop: '2.8rem'}}>
            <p style={{...serifSm, fontSize: '0.54rem', letterSpacing: '0.38em', color: 'rgba(90,76,62,0.28)', marginBottom: '1.2rem'}}>
              {sub.label}
            </p>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem'}}>
              {sub.paragraphs.map((p, i) => (
                <p key={i} style={serifBody}>{p}</p>
              ))}
            </div>

            <ImageGrid images={sub.images} cols={sub.images.length === 1 ? 1 : 2} />

            {sub.links.length > 0 && (
              <div style={{display: 'flex', gap: '2rem', marginTop: '1.5rem'}}>
                {sub.links.map(l => <ExtLink key={l.href} href={l.href} label={l.label} />)}
              </div>
            )}
          </div>
        ))}
      </section>

      <Divider />

      {/* ── Contact ── */}
      <section style={{width: '100%', maxWidth: '640px'}}>
        <p style={{...serifSm, marginBottom: '1.5rem'}}>{s.contact.label}</p>

        <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
          {s.contact.links.map(({label, href}) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{...serifBody, color: 'rgba(50,38,28,0.52)', textDecoration: 'none', transition: 'color 0.3s ease'}}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(50,38,28,0.88)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(50,38,28,0.52)' }}
            >
              {label}
            </a>
          ))}
        </div>

        <div style={{display: 'flex', gap: '2.5rem', marginTop: '2.5rem'}}>
          {s.contact.social.map(({label, href}) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{...serifSm, color: 'rgba(90,76,62,0.42)', textDecoration: 'none', transition: 'color 0.3s ease'}}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(90,76,62,0.85)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(90,76,62,0.42)' }}
            >
              {label}
            </a>
          ))}
        </div>
      </section>

    </main>
  )
}
