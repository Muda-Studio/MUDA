import { useRef } from 'react'
import styles from './Produccion.module.css'

const servicios = [
  {
    num: '01', icon: '◎',
    title: 'Producción de fotos & video',
    desc: 'Servicio integral de producción y dirección. Maquilladorx, peinadorx, fotógrafx, búsqueda de locación, dirección de arte (escenografía) y estilismo. Si ya contás con algunos de estos elementos, contratás solo lo que necesitás.',
    tags: ['Shooting', 'Locación', 'Estilismo', 'Arte'],
  },
  {
    num: '02', icon: '◈',
    title: 'Dirección Creativa Visual',
    desc: 'Conceptualización estética y visual de campañas, videoclips y perfiles. Te acompañamos creativamente desde tu idea inicial. Desarrollo del concepto visual, moodboards, coordinación y ejecución estética. Somos tu soporte creativo.',
    tags: ['Concepto', 'Moodboard', 'Campaña', 'Videoclip'],
  },
  {
    num: '03', icon: '◇',
    title: 'Contenido para Redes',
    desc: 'Creación de contenido estratégico para tu presencia digital. Producción y dirección creativa especialmente enfocada en comunicación y presencia en redes sociales para marcas y artistas.',
    tags: ['Redes', 'Branding', 'Contenido', 'Digital'],
  },
]

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 14
    ref.current.style.transition = 'transform 0.08s linear'
    ref.current.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(10px)`
  }

  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)'
    ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)'
  }

  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}

export default function Produccion() {
  return (
    <section className={styles.section} data-nav="light">
      <div className="section-inner">
        <p className="section-label reveal">☆ Servicios</p>
        <h2 className={`${styles.heading} reveal`}>
          Producción <em>foto & video</em><br />+ contenido para redes
        </h2>

        <div className={styles.grid}>
          {servicios.map((s) => (
            <TiltCard
              key={s.num}
              className={`${styles.card} servicio-card reveal`}
            >
              <span className={styles.num}>{s.num}</span>
              <span className={styles.icon}>{s.icon}</span>
              <h3 className={styles.cardTitle}>{s.title}</h3>
              <p className={styles.desc}>{s.desc}</p>
              <div className={styles.tags}>
                {s.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </TiltCard>
          ))}
        </div>

        <div className={`${styles.nota} reveal`}>
          <p>
            ☆ El costo de cada servicio queda sujeto al proyecto: plazos, cantidad de personal,
            material y horas de trabajo. Todo servicio requiere reuniones de pre y post producción
            (virtuales o presenciales).
          </p>
        </div>
      </div>
    </section>
  )
}
