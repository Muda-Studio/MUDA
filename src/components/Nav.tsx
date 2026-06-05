import { useEffect, useRef, useState } from 'react'
import type { View } from '../App'
import styles from './Nav.module.css'

const links: { view: View; label: string }[] = [
  { view: 'eventos',  label: 'Eventos' },
  { view: 'agencia',  label: 'Agencia' },
  { view: 'estudio',  label: 'Estudio' },
]

const produccionSubs: { view: View; label: string; num: string }[] = [
  { view: 'foto-video',         label: 'Producción foto & video', num: '01' },
  { view: 'direccion-creativa', label: 'Dirección Creativa Visual', num: '02' },
  { view: 'contenido-redes',    label: 'Contenido para Redes',     num: '03' },
]

const produccionViews: View[] = ['produccion', 'foto-video', 'direccion-creativa', 'contenido-redes']

type Props = { current: View; navigate: (v: View) => void }

export default function Nav({ current, navigate }: Props) {
  const [onLight, setOnLight]   = useState(true)
  const [dropOpen, setDropOpen] = useState(false)
  const [dropLeft, setDropLeft] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProdOpen, setMobileProdOpen] = useState(false)
  const dropRef  = useRef<HTMLLIElement>(null)
  const navRef   = useRef<HTMLElement>(null)

  // Navegar y cerrar menú mobile
  const go = (v: View) => { setMobileOpen(false); setDropOpen(false); setMobileProdOpen(false); navigate(v) }

  /* ── Detectar fondo ───────────────────────────────────────── */
  useEffect(() => {
    const check = () => {
      const els = document.elementsFromPoint(window.innerWidth / 2, 55)
      for (const el of els) {
        if (el.closest('nav')) continue
        const themed = el.closest('[data-nav]')
        if (!themed) continue
        const theme = themed.getAttribute('data-nav')
        if (theme === 'light') { setOnLight(true);  return }
        if (theme === 'dark')  { setOnLight(false); return }
      }
    }
    const scrollEl = document.querySelector<HTMLElement>('.view-wrap')
    scrollEl?.addEventListener('scroll', check, { passive: true })
    const t = setTimeout(check, 60)
    return () => { scrollEl?.removeEventListener('scroll', check); clearTimeout(t) }
  }, [current])

  /* ── Cerrar dropdown al click fuera ──────────────────────── */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setDropOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const isProduccionActive = produccionViews.includes(current)

  return (
    <nav ref={navRef} className={`${styles.nav} ${onLight ? styles.light : ''} ${mobileOpen ? styles.menuOpen : ''}`}>
      <button className={styles.logo} onClick={() => navigate('inicio')}>
        MUDA
      </button>

      <ul className={styles.links}>
        {/* 1 — Quiénes somos */}
        <li>
          <button
            className={`${styles.link} ${current === 'quienes' ? styles.active : ''}`}
            onClick={() => navigate('quienes')}
          >
            Quiénes somos
          </button>
        </li>

        {/* 2 — Producción con dropdown */}
        <li
          ref={dropRef}
          className={styles.dropWrap}
          onMouseEnter={() => {
            if (dropRef.current && navRef.current) {
              const li  = dropRef.current.getBoundingClientRect()
              const nav = navRef.current.getBoundingClientRect()
              setDropLeft(li.left - nav.left + li.width / 2)
            }
            setDropOpen(true)
          }}
          onMouseLeave={(e) => {
            const related = e.relatedTarget as Node
            if (!navRef.current?.contains(related)) setDropOpen(false)
          }}
        >
          <button
            className={`${styles.link} ${isProduccionActive ? styles.active : ''}`}
            onClick={() => { setDropOpen(false); navigate('foto-video') }}
          >
            Producción
            <span className={styles.dropArrow}>▾</span>
          </button>
        </li>

        {/* 3, 4, 5 — Eventos · Agencia · Estudio */}
        {links.map(l => (
          <li key={l.view}>
            <button
              className={`${styles.link} ${current === l.view ? styles.active : ''}`}
              onClick={() => navigate(l.view)}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Dropdown — hijo del nav, aparece justo debajo */}
      <div
        className={`${styles.dropdown} ${dropOpen ? styles.dropVisible : ''} ${onLight ? styles.dropLight : ''}`}
        style={{ left: dropLeft }}
        onMouseLeave={(e) => {
          const related = e.relatedTarget as Node
          if (!navRef.current?.contains(related)) setDropOpen(false)
        }}
      >
        {produccionSubs.map(s => (
          <button
            key={s.view}
            className={`${styles.dropItem} ${current === s.view ? styles.dropItemActive : ''}`}
            onClick={() => { setDropOpen(false); navigate(s.view) }}
          >
            <span className={styles.dropNum}>{s.num}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.cta}>
        <button
          className={`${styles.ctaBtn} ${current === 'contacto' ? styles.ctaActive : ''}`}
          onClick={() => navigate('contacto')}
        >
          Contacto
        </button>
      </div>

      {/* Botón hamburguesa — solo mobile */}
      <button
        className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ''}`}
        onClick={() => setMobileOpen(o => !o)}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>

      {/* Panel mobile */}
      <div className={`${styles.mobilePanel} ${mobileOpen ? styles.mobileVisible : ''}`}>
        <button className={`${styles.mobileLink} ${current === 'quienes' ? styles.mobileActive : ''}`}
          onClick={() => go('quienes')}>Quiénes somos</button>

        {/* Producción — acordeón */}
        <button
          className={`${styles.mobileLink} ${styles.mobileProdToggle} ${isProduccionActive ? styles.mobileActive : ''}`}
          onClick={() => setMobileProdOpen(o => !o)}
        >
          Producción
          <span className={`${styles.mobileArrow} ${mobileProdOpen ? styles.mobileArrowOpen : ''}`}>▾</span>
        </button>
        <div className={`${styles.mobileSub} ${mobileProdOpen ? styles.mobileSubOpen : ''}`}>
          {produccionSubs.map(s => (
            <button key={s.view}
              className={`${styles.mobileSubLink} ${current === s.view ? styles.mobileActive : ''}`}
              onClick={() => go(s.view)}>
              <span className={styles.dropNum}>{s.num}</span> {s.label}
            </button>
          ))}
        </div>

        {links.map(l => (
          <button key={l.view}
            className={`${styles.mobileLink} ${current === l.view ? styles.mobileActive : ''}`}
            onClick={() => go(l.view)}>{l.label}</button>
        ))}

        <button className={`${styles.mobileCta} ${current === 'contacto' ? styles.mobileActive : ''}`}
          onClick={() => go('contacto')}>Contacto</button>
      </div>
    </nav>
  )
}
