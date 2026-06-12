import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { View } from '../App'
import { supabase, type Talento } from '../lib/supabase'
import { imgUrl } from '../lib/cloudinary'
import { whatsappLink } from '../lib/config'
import MagneticLine from './MagneticLine'
import styles from './Agencia.module.css'

const tabs = [
  { key: 'modelos',       label: 'Modelos' },
  { key: 'fotografos',    label: 'Fotógrafxs' },
  { key: 'maquilladores', label: 'Maquilladorxs' },
]

const ROL_LABEL: Record<string, string> = {
  modelos: 'Modelo', fotografos: 'Fotógrafx', maquilladores: 'Maquilladorx',
}

/* ── Card (solo nombre + rol) ──────────────────────────────── */
function TalentCard({ t, onClick }: { t: Talento; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 10
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 10
    ref.current.style.transition = 'transform 0.08s linear'
    ref.current.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(6px)`
  }
  const handleLeave = () => {
    if (ref.current) {
      ref.current.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)'
      ref.current.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)'
    }
  }

  return (
    <div ref={ref} className={`${styles.card} talent-card`}
      onMouseMove={onMove} onMouseLeave={handleLeave} onClick={onClick}
    >
      <div className={styles.cardImgWrap}>
        {t.portada_1
          ? <>
              <img src={imgUrl(t.portada_1, 'w_400,h_520,c_fill,q_auto')} alt={t.nombre} className={styles.cardImg} />
              {t.portada_2 && <img src={imgUrl(t.portada_2, 'w_400,h_520,c_fill,q_auto')} alt="" className={`${styles.cardImg} ${styles.cardImg2}`} />}
            </>
          : <div className={styles.initial}>{t.nombre[0]}</div>
        }
        <span className={styles.cardView}>Ver perfil →</span>
      </div>
      <p className={styles.name}>{t.nombre}</p>
      <p className={styles.role}>{t.rol || ROL_LABEL[t.categoria]}</p>
    </div>
  )
}

/* ── Popup de detalle ──────────────────────────────────────── */
export function TalentDetail({ t, onClose }: { t: Talento; onClose: () => void }) {
  const fotos = [t.portada_1, t.portada_2, ...(t.galeria ?? [])].filter(Boolean)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)

  const nav = (d: number) => setActive(a => (a + d + fotos.length) % fotos.length)

  // Teclado + bloquear scroll de la web (el scroll real está en .view-wrap)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { zoom ? setZoom(false) : onClose() }
      if (zoom && e.key === 'ArrowRight') nav(1)
      if (zoom && e.key === 'ArrowLeft') nav(-1)
    }
    document.addEventListener('keydown', onKey)
    const scrollEl = document.querySelector<HTMLElement>('.view-wrap')
    const prev = scrollEl?.style.overflow
    if (scrollEl) scrollEl.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      if (scrollEl) scrollEl.style.overflow = prev ?? ''
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, zoom, fotos.length])

  // Rotación automática de la galería (se pausa con el zoom abierto)
  useEffect(() => {
    if (fotos.length < 2 || zoom) return
    const id = setInterval(() => setActive(a => (a + 1) % fotos.length), 2800)
    return () => clearInterval(id)
  }, [fotos.length, zoom])

  const isModelo = t.categoria === 'modelos'

  // Agrega "cm" a las medidas numéricas (si no lo traen ya)
  const cm = (v: string) => v && /^\s*\d+([.,]\d+)?\s*$/.test(v) ? `${v.trim()} cm` : v

  const datos: [string, string][] = isModelo
    ? ([
        ['Edad',     t.edad ? `${t.edad} años` : ''],
        ['Altura',   t.altura],
        ['Hombros',  cm(t.hombros)],
        [t.busto_label || 'Busto', cm(t.busto)],
        ['Cintura',  cm(t.cintura)],
        ['Cadera',   cm(t.cadera)],
        ['Remera',   t.talle_ropa],
        ['Pantalón', t.talle_pantalon],
        ['Calzado',  t.talle_calzado],
        ['Pelo',     t.pelo],
        ['Ojos',     t.ojos],
      ] as [string, string][]).filter(([, v]) => v)
    : ([['Edad', t.edad ? `${t.edad} años` : '']] as [string, string][]).filter(([, v]) => v)

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>

        {/* Galería de fotos */}
        <div className={styles.modalGallery}>
          <div className={styles.modalMain} onClick={() => fotos[active] && setZoom(true)}>
            {fotos[active]
              ? <img key={active} src={imgUrl(fotos[active], 'w_1100,q_auto')} alt={t.nombre} className={styles.modalMainImg} />
              : <div className={styles.modalNoImg}>{t.nombre[0]}</div>}
            {fotos[active] && <span className={styles.modalZoomHint}>⤢</span>}
          </div>
          {fotos.length > 1 && (
            <div className={styles.modalThumbs}>
              {fotos.map((u, i) => (
                <button key={i}
                  className={`${styles.modalThumb} ${i === active ? styles.modalThumbActive : ''}`}
                  onClick={() => setActive(i)}>
                  <img src={imgUrl(u, 'w_120,h_150,c_fill,q_auto')} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Datos */}
        <div className={styles.modalInfo}>
          <p className={styles.modalRole}>{t.rol || ROL_LABEL[t.categoria]}</p>
          <h2 className={styles.modalName}>{t.nombre}</h2>

          {t.ubicacion && (
            <p className={styles.modalUbic}>
              <svg className={styles.modalPin} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {t.ubicacion}
            </p>
          )}

          {!isModelo && t.estilo && <p className={styles.modalEstilo}>{t.estilo}</p>}

          {datos.length > 0 && (
            <div className={styles.modalDatos}>
              {datos.map(([k, v]) => (
                <div key={k} className={styles.modalDato}>
                  <span className={styles.modalDatoK}>{k}</span>
                  <span className={styles.modalDatoV}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Formación / Experiencia — a todo el ancho (puede ser texto largo) */}
          {t.formacion && (
            <div className={styles.modalFormacion}>
              <span className={styles.modalDatoK}>Formación / Experiencia</span>
              <p className={styles.modalFormacionText}>{t.formacion}</p>
            </div>
          )}

          <a className={styles.modalCta}
            href={whatsappLink(`¡Hola MUDA! Quiero contratar a ${t.nombre} (${t.rol || ROL_LABEL[t.categoria]}).`)}
            target="_blank" rel="noopener">
            Quiero contratar a {t.nombre.split(' ')[0]} →
          </a>
          <p className={styles.modalNote}>Te conectamos por WhatsApp con MUDA</p>
        </div>
      </div>

      {/* Visor a pantalla completa (imagen entera, sin recortes) */}
      {zoom && fotos[active] && (
        <div className={styles.tViewer} onClick={e => { e.stopPropagation(); setZoom(false) }}>
          <button className={styles.tvClose} onClick={e => { e.stopPropagation(); setZoom(false) }} aria-label="Cerrar">✕</button>
          {fotos.length > 1 && (
            <button className={`${styles.tvArrow} ${styles.tvPrev}`} onClick={e => { e.stopPropagation(); nav(-1) }} aria-label="Anterior">←</button>
          )}
          <img
            className={styles.tvImg}
            src={imgUrl(fotos[active], 'w_1700,q_auto')}
            alt={t.nombre}
            onClick={e => e.stopPropagation()}
          />
          {fotos.length > 1 && (
            <button className={`${styles.tvArrow} ${styles.tvNext}`} onClick={e => { e.stopPropagation(); nav(1) }} aria-label="Siguiente">→</button>
          )}
          <span className={styles.tvCount}>{String(active + 1).padStart(2, '0')} / {String(fotos.length).padStart(2, '0')}</span>
        </div>
      )}
    </div>,
    document.body
  )
}

export default function Agencia({ navigate }: { navigate?: (v: View) => void }) {
  const [active, setActive]   = useState('modelos')
  const [talentos, setTalentos] = useState<Talento[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Talento | null>(null)

  useEffect(() => {
    supabase.from('talentos').select('*').order('created_at', { ascending: true })
      .then(({ data }) => { setTalentos(data ?? []); setLoading(false) })
  }, [])

  const current = talentos.filter(t => t.categoria === active)

  return (
    <section className={styles.section} data-nav="light">
      {selected && <TalentDetail t={selected} onClose={() => setSelected(null)} />}

      <div className="section-inner">
        {/* Header limpio — sin reveal para que esté siempre visible */}
        <div className={styles.intro}>
          <p className={styles.label}>☆ Agencia</p>
          <h2 className={styles.heading}>
            <MagneticLine segments={[{ text: 'Base de ' }, { text: 'talentos.', italic: true }]} />
          </h2>
          <p className={styles.desc}>
            Una red curada de modelxs, fotógrafxs y maquilladorxs.<br />
            Contratá cualquier perfil de forma independiente.
          </p>
        </div>

        <div className={styles.tabs}>
          {tabs.map(t => (
            <button key={t.key}
              className={`${styles.tabBtn} ${active === t.key ? styles.tabActive : ''}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {loading
            ? <p style={{ padding: '3rem', fontFamily: 'var(--f-mono)', fontSize: '0.7rem', color: 'rgba(10,9,8,0.3)' }}>Cargando…</p>
            : current.map(t => <TalentCard key={t.id} t={t} onClick={() => setSelected(t)} />)
          }
        </div>

        {/* CTA al final */}
        <div className={styles.joinBand}>
          <div className={styles.joinText}>
            <p className={styles.joinLabel}>¿Querés formar parte?</p>
            <h3 className={styles.joinTitle}>
              <MagneticLine text="Sumate a" />
              <MagneticLine text="la base." italic />
            </h3>
          </div>
          <div className={styles.joinActions}>
            <button className={styles.joinBtn} onClick={() => navigate?.('sumate')}>
              Completar formulario →
            </button>
            <a className={styles.joinWa}
              href={whatsappLink('¡Hola MUDA! Quiero sumarme a la base de talentos.')}
              target="_blank" rel="noopener">
              o escribinos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
