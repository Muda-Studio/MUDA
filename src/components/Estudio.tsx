import { useRef } from 'react'
import styles from './Estudio.module.css'

const features = [
  { title: 'Sala Infinito', desc: 'Sala principal tipo infinito de cuatro paredes. Ideal para sesiones de fotos, campañas de moda, creación de contenido y producciones comerciales.' },
  { title: 'Salas múltiples', desc: 'Salas de usos múltiples adaptables a cada proyecto: vestuario, reuniones de producción, maquillaje o espacios de trabajo.' },
  { title: 'Catering incluido', desc: 'El servicio de alquiler incluye catering para el equipo de trabajo, brindando mayor comodidad durante la jornada.' },
  { title: 'Servicios add-on', desc: 'Posibilidad de sumar maquilladora y fotógrafe profesional, a criterio y preferencia de cada cliente.' },
]

export default function Estudio() {
  const visualRef = useRef<HTMLDivElement>(null)
  const roomRef   = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const vis = visualRef.current
    const room = roomRef.current
    if (!vis || !room) return
    const r = vis.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 22
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 22
    room.style.transition = 'transform 0.1s linear'
    room.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.03)`
  }

  const onLeave = () => {
    if (!roomRef.current) return
    roomRef.current.style.transition = 'transform 0.8s cubic-bezier(0.16,1,0.3,1)'
    roomRef.current.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <section className={styles.section} data-nav="light">
      <div className={styles.layout}>
        <div className={styles.content}>
          <p className="section-label reveal">☆ Estudio</p>
          <h2 className={`${styles.heading} reveal`}>
            El espacio<br />donde todo<br /><em>cobra vida.</em>
          </h2>
          <p className={`${styles.location} reveal`}>Palermo, Buenos Aires</p>
          <p className={`${styles.desc} reveal d1`}>
            En MUDA contamos con un espacio en Palermo pensado para la realización de
            producciones fotográficas, audiovisuales y proyectos creativos de todo tipo.
          </p>
          <div className={`${styles.features} reveal d2`}>
            {features.map(f => (
              <div key={f.title} className={styles.feature}>
                <p className={styles.featureTitle}>{f.title}</p>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div ref={visualRef} className={styles.visual} onMouseMove={onMove} onMouseLeave={onLeave}>
          <div ref={roomRef} className={`${styles.room} reveal`}>
            <p className={styles.roomLabel}>Sala Infinito<br />4 paredes</p>
          </div>
          <div className={`${styles.tags} reveal d1`}>
            {['Producciones fotográficas','Audiovisual','Proyectos creativos','Campañas de moda','Creación de contenido'].map(t => (
              <span key={t} className={styles.vtag}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
