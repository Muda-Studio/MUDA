import { useRef } from 'react'
import styles from './Eventos.module.css'
import Portfolio from './Portfolio'
import MagneticLine from './MagneticLine'

const incluye = [
  'Conceptualización del evento',
  'Desarrollo estético',
  'Búsqueda y gestión de locación',
  'Armado de ambientación',
  'Selección y coordinación de proveedores',
  'Catering, música e iluminación',
  'Supervisión el día del evento',
]

export default function Eventos() {
  const sectionRef = useRef<HTMLElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <section ref={sectionRef} className={styles.section} data-nav="light" onMouseMove={onMove}>
      <div className="section-inner">
        <p className="section-label reveal">☆ Organización de eventos</p>

        <div className={styles.layout}>
          <div className={styles.left}>
            <h2 className={`${styles.heading} reveal`}>
              <MagneticLine text="Cada evento," />
              <MagneticLine text="una experiencia" italic />
              <MagneticLine text="visual y conceptual." />
            </h2>
            <p className={`${styles.desc} reveal d1`}>
              Desarrollamos el servicio de organización de eventos desde una mirada creativa y
              estética. Nos encargamos de la planificación, producción y coordinación general,
              trabajando desde la idea inicial hasta su ejecución, alineados con la identidad
              de cada marca o persona.
            </p>
            <p className={`${styles.pull} reveal d2`}>
              Experiencias coherentes,<br />cuidadas y memorables.
            </p>
          </div>

          <div className={`${styles.panel} reveal d1`}>
            <p className={styles.panelLabel}>El servicio incluye</p>
            <ul className={styles.list}>
              {incluye.map((item, i) => (
                <li key={item} style={{ transitionDelay: `${0.3 + i * 0.06}s` }}>
                  <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Galería de eventos realizados */}
        <div className={styles.eventos}>
          <h3 className={`${styles.eventosH} reveal`}>
            <MagneticLine segments={[{ text: 'Eventos ' }, { text: 'realizados.', italic: true }]} />
          </h3>
          <Portfolio categoria="evento" emptyText="Pronto, nuestros eventos…" />
        </div>
      </div>
    </section>
  )
}
