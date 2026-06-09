import { useRef, useState, useEffect } from 'react'
import type { View } from '../App'
import styles from './Estudio.module.css'
import { imgUrl } from '../lib/cloudinary'
import { ESTUDIO_FX } from '../lib/estudioFotos'
import { whatsappLink, WEB3FORMS_KEY, MUDA_EMAIL } from '../lib/config'

type Chapter = {
  n: string
  title: string
  kicker: string
  desc: string
  fx: boolean
  photos: string[]
}

const chapters: Chapter[] = [
  {
    n: '01',
    title: 'Espacio Infinito',
    kicker: 'Sala blanca',
    desc: 'Sala principal tipo infinito de cuatro paredes. Ideal para sesiones de fotos, campañas de moda, creación de contenido y producciones comerciales.',
    fx: true,
    photos: ['espacio1_wmgx1f', 'espacio3_wiwpo3', 'espacio2_b7rpbk'],
  },
  {
    n: '02',
    title: 'Salas Privadas',
    kicker: 'Espacios íntimos',
    desc: 'Salas de usos múltiples adaptables a cada proyecto: vestuario, reuniones de producción, maquillaje o espacios de trabajo.',
    fx: false,
    photos: [
      'WhatsApp_Image_2026-06-09_at_08.29.49_jj8uy2',
      'WhatsApp_Image_2026-06-09_at_08.29.49_1_uxgvvq',
      'WhatsApp_Image_2026-06-09_at_08.30.07_nvfadc',
    ],
  },
  {
    n: '03',
    title: 'Café & Comida',
    kicker: 'Pausa',
    desc: 'El servicio de alquiler incluye catering para el equipo de trabajo, brindando mayor comodidad durante la jornada.',
    fx: false,
    photos: [
      'WhatsApp_Image_2026-06-09_at_08.30.07_1_rnvsjz',
      'WhatsApp_Image_2026-06-09_at_08.30.06_livted',
    ],
  },
]

// Ancho fijo, alto natural → en desktop la foto se ve completa, sin recortes
const pic = (id: string, fx: boolean) =>
  imgUrl(id, `${fx ? `${ESTUDIO_FX},` : ''}w_1000,q_auto,f_auto`)

const SLIDE_MS = 3800 // tiempo en cada imagen del carrusel (mobile)

// Anima el scroll horizontal a mano (no depende de scroll-behavior: smooth)
function animateScroll(el: HTMLElement, target: number, dur = 650) {
  const start = el.scrollLeft
  const change = target - start
  if (Math.abs(change) < 1) return
  const t0 = performance.now()
  const step = (now: number) => {
    const p = Math.min((now - t0) / dur, 1)
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
    el.scrollLeft = start + change * ease
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/* Fotos del capítulo:
   - desktop: pila vertical (alto natural, sin recortes)
   - mobile: carrusel que pasa solo, infinito, y se puede deslizar a mano */
function ChapterPhotos({ ch }: { ch: Chapter }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const pausedUntil = useRef(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el || ch.photos.length < 2) return
    const mq = window.matchMedia('(max-width: 760px)')

    const timer = window.setInterval(() => {
      if (!mq.matches || !el.clientWidth || Date.now() < pausedUntil.current) return
      const cur = Math.round(el.scrollLeft / el.clientWidth)
      const next = (cur + 1) % ch.photos.length
      animateScroll(el, el.clientWidth * next)
    }, SLIDE_MS)

    const onScroll = () => {
      if (el.clientWidth) setActive(Math.round(el.scrollLeft / el.clientWidth))
    }
    // al tocar/deslizar, pausa el auto unos segundos
    const onTouch = () => { pausedUntil.current = Date.now() + 6000 }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('touchstart', onTouch, { passive: true })
    return () => {
      clearInterval(timer)
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('touchstart', onTouch)
    }
  }, [ch.photos.length])

  const goTo = (i: number) => {
    const el = trackRef.current
    if (!el) return
    pausedUntil.current = Date.now() + 6000
    animateScroll(el, el.clientWidth * i)
  }

  return (
    <div className={styles.photos}>
      <div className={styles.track} ref={trackRef}>
        {ch.photos.map(id => (
          <figure key={id} className={styles.cell}>
            <img
              src={pic(id, ch.fx)}
              alt={`Estudio MUDA — ${ch.title}`}
              loading="lazy"
              className={styles.cellImg}
            />
          </figure>
        ))}
      </div>
      {ch.photos.length > 1 && (
        <div className={styles.dots}>
          {ch.photos.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === active ? styles.dotOn : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const TIPOS = ['Sesión de fotos', 'Audiovisual', 'Creación de contenido', 'Campaña / e-commerce', 'Otro']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const HORAS = ['—', ...Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))]
const MINS = ['—', '00', '15', '30', '45']

/* Select custom (diseñado, no el nativo del navegador) */
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return (
    <div className={styles.select} ref={ref}>
      <button
        type="button"
        className={`${styles.selectBtn} ${open ? styles.selectOpen : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{value}</span>
        <span className={styles.selectChevron}>⌄</span>
      </button>
      {open && (
        <ul className={styles.selectList}>
          {options.map(o => (
            <li key={o}>
              <button
                type="button"
                className={`${styles.selectOpt} ${o === value ? styles.selectOptOn : ''}`}
                onClick={() => { onChange(o); setOpen(false) }}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* Calendario custom: mes/año navegables, día, horario opcional y "soy flexible" */
function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'days' | 'months'>('days')
  const t = new Date(); t.setHours(0, 0, 0, 0)
  const [vy, setVy] = useState(t.getFullYear())
  const [vm, setVm] = useState(t.getMonth())
  const [sel, setSel] = useState<Date | null>(null)
  const [flexible, setFlexible] = useState(false)
  const [hora, setHora] = useState('—')
  const [minuto, setMinuto] = useState('—')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (flexible) { onChange('Soy flexible con la fecha'); return }
    if (!sel) { onChange(''); return }
    const d = `${String(sel.getDate()).padStart(2, '0')}/${String(sel.getMonth() + 1).padStart(2, '0')}/${sel.getFullYear()}`
    const time = hora !== '—' ? ` · ${hora}:${minuto === '—' ? '00' : minuto}` : ''
    onChange(d + time)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, flexible, hora, minuto])

  const shift = (delta: number) => {
    let m = vm + delta, y = vy
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setVm(m); setVy(y)
  }

  const today = new Date(); today.setHours(0, 0, 0, 0)
  const firstOffset = (new Date(vy, vm, 1).getDay() + 6) % 7
  const daysIn = new Date(vy, vm + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstOffset).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)]

  const filled = flexible || !!sel
  const label = flexible ? 'Soy flexible con la fecha' : sel ? value : 'Elegí una fecha'

  return (
    <div className={styles.dp} ref={ref}>
      <button type="button" className={`${styles.selectBtn} ${open ? styles.selectOpen : ''}`} onClick={() => setOpen(o => !o)}>
        <span className={filled ? '' : styles.dpPlaceholder}>{label}</span>
        <span className={styles.selectChevron}>⌄</span>
      </button>
      {open && (
        <div className={styles.dpPop}>
          {view === 'days' ? (
            <>
              <div className={styles.dpHead}>
                <button type="button" className={styles.dpArrow} onClick={() => shift(-1)} aria-label="Mes anterior">‹</button>
                <button type="button" className={styles.dpTitle} onClick={() => setView('months')}>{MESES[vm]} {vy}</button>
                <button type="button" className={styles.dpArrow} onClick={() => shift(1)} aria-label="Mes siguiente">›</button>
              </div>
              <div className={styles.dpWeek}>{DIAS.map(d => <span key={d}>{d}</span>)}</div>
              <div className={styles.dpGrid}>
                {cells.map((d, i) => {
                  if (d === null) return <span key={'e' + i} />
                  const date = new Date(vy, vm, d)
                  const past = date < today
                  const on = !!sel && date.getTime() === sel.getTime()
                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={past}
                      className={`${styles.dpDay} ${on ? styles.dpDayOn : ''}`}
                      onClick={() => { setSel(new Date(vy, vm, d)); setFlexible(false) }}
                    >{d}</button>
                  )
                })}
              </div>
              <div className={styles.dpTime}>
                <span className={styles.dpTimeLabel}>Horario (opcional)</span>
                <div className={styles.dpTimeRow}>
                  <Select value={hora} onChange={setHora} options={HORAS} />
                  <span className={styles.dpColon}>:</span>
                  <Select value={minuto} onChange={setMinuto} options={MINS} />
                </div>
              </div>
              <button type="button" className={styles.dpFlex} onClick={() => { setFlexible(true); setSel(null); setOpen(false) }}>
                No sé la fecha aún · soy flexible
              </button>
            </>
          ) : (
            <>
              <div className={styles.dpHead}>
                <button type="button" className={styles.dpArrow} onClick={() => setVy(vy - 1)} aria-label="Año anterior">‹</button>
                <span className={styles.dpTitle}>{vy}</span>
                <button type="button" className={styles.dpArrow} onClick={() => setVy(vy + 1)} aria-label="Año siguiente">›</button>
              </div>
              <div className={styles.dpMonths}>
                {MESES.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    className={`${styles.dpMonthBtn} ${i === vm ? styles.dpMonthOn : ''}`}
                    onClick={() => { setVm(i); setView('days') }}
                  >{m.slice(0, 3)}</button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* Formulario de consulta → manda un mail con los datos a MUDA */
function ConsultaForm() {
  const [f, setF] = useState({ nombre: '', email: '', telefono: '', fecha: '', tipo: TIPOS[0], mensaje: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF(s => ({ ...s, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Opción A: envío silencioso por Web3Forms (si hay access key cargada)
    if (WEB3FORMS_KEY) {
      setStatus('sending')
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Consulta de estudio — ${f.nombre || 'sin nombre'}`,
            from_name: 'Web MUDA · Estudio',
            Nombre: f.nombre,
            Email: f.email,
            'WhatsApp / Teléfono': f.telefono,
            'Para cuándo': f.fecha,
            'Tipo de producción': f.tipo,
            Mensaje: f.mensaje,
          }),
        })
        const data = await res.json()
        setStatus(data.success ? 'sent' : 'error')
      } catch {
        setStatus('error')
      }
      return
    }

    // Opción B (fallback): abre el mail del usuario ya armado hacia MUDA
    if (MUDA_EMAIL) {
      const body = [
        `Nombre: ${f.nombre}`,
        `Email: ${f.email}`,
        `WhatsApp / Teléfono: ${f.telefono}`,
        `Para cuándo: ${f.fecha}`,
        `Tipo de producción: ${f.tipo}`,
        '',
        f.mensaje,
      ].join('\n')
      window.location.href =
        `mailto:${MUDA_EMAIL}?subject=${encodeURIComponent(`Consulta de estudio — ${f.nombre || ''}`)}&body=${encodeURIComponent(body)}`
      setStatus('mailto')
      return
    }

    setStatus('error')
  }

  if (status === 'sent') {
    return (
      <div className={styles.formDone}>
        <p className={styles.formDoneTitle}>¡Consulta enviada! ✓</p>
        <p className={styles.formDoneText}>Te contactamos a la brevedad. ¡Gracias!</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.formRow}>
        <input className={styles.input} placeholder="Nombre" required value={f.nombre} onChange={set('nombre')} />
        <input className={styles.input} type="email" placeholder="Email" required value={f.email} onChange={set('email')} />
      </div>
      <div className={styles.formRow}>
        <input className={styles.input} placeholder="WhatsApp / teléfono" value={f.telefono} onChange={set('telefono')} />
        <DatePicker value={f.fecha} onChange={v => setF(s => ({ ...s, fecha: v }))} />
      </div>
      <Select value={f.tipo} onChange={v => setF(s => ({ ...s, tipo: v }))} options={TIPOS} />
      <textarea
        className={styles.textarea}
        placeholder="Contanos tu proyecto: qué necesitás, fechas, equipo…"
        rows={3}
        value={f.mensaje}
        onChange={set('mensaje')}
      />
      <button className={styles.formBtn} type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar consulta →'}
      </button>
      {status === 'mailto' && (
        <p className={styles.formHint}>Te abrimos tu app de mail con la consulta lista para enviar ✉️</p>
      )}
      {status === 'error' && (
        <p className={styles.formError}>No se pudo enviar. Probá por WhatsApp 👉</p>
      )}
    </form>
  )
}

export default function Estudio({ navigate }: { navigate: (v: View) => void }) {
  return (
    <section className={styles.section} data-nav="dark">
      {/* ── Encabezado ── */}
      <header className={styles.head}>
        <p className={styles.eyebrow}>Palermo · Buenos Aires</p>
        <h2 className={styles.headTitle}>El <em>estudio.</em></h2>
        <p className={styles.headText}>
          En MUDA contamos con un espacio en Palermo pensado para la realización de
          producciones fotográficas, audiovisuales y proyectos creativos de todo tipo.
        </p>
      </header>

      {/* ── Capítulos alternados ── */}
      <div className={styles.mag}>
        {chapters.map((ch, idx) => (
          <section
            key={ch.n}
            className={`${styles.chapter} ${idx % 2 === 1 ? styles.reverse : ''}`}
          >
            <div className={styles.text}>
              <span className={styles.chapterNum}>{ch.n}</span>
              <span className={styles.chapterKicker}>{ch.kicker}</span>
              <h3 className={styles.chapterTitle}>{ch.title}</h3>
              <p className={styles.chapterDesc}>{ch.desc}</p>
            </div>

            <ChapterPhotos ch={ch} />
          </section>
        ))}
      </div>

      {/* ── CTA con formulario ── */}
      <div className={styles.cta}>
        <div className={styles.ctaLeft}>
          <h3 className={styles.ctaTitle}>¿Reservás<br />tu <em>producción?</em></h3>
          <p className={styles.ctaText}>
            Contános tu proyecto y armamos la jornada en el estudio. Podés sumar
            maquilladora y fotógrafe profesional, a criterio de cada cliente.
          </p>
          <a
            className={styles.ctaBtn}
            href={whatsappLink('¡Hola MUDA! Quiero alquilar el estudio para una producción.')}
            target="_blank"
            rel="noopener"
          >
            Escribinos por WhatsApp →
          </a>
          <button className={styles.ctaGhost} onClick={() => navigate('contacto')}>
            Ver contacto
          </button>
        </div>

        <div className={styles.ctaRight}>
          <p className={styles.formLabel}>O dejanos tu consulta</p>
          <ConsultaForm />
        </div>
      </div>
    </section>
  )
}
