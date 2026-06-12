import { useRef } from 'react'
import MagneticLine from './MagneticLine'
import styles from './QuienesSomos.module.css'

function ScrambleHeading() {
  return (
    <h2 className={styles.heading}>
      <MagneticLine text="Estética" />
      <MagneticLine segments={[{ text: 'con ' }, { text: 'propósito.', italic: true }]} />
    </h2>
  )
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 18
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 18
    ref.current.style.transition = 'transform 0.08s linear'
    ref.current.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(16px)`
  }

  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)'
    ref.current.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)'
  }

  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}

const diferencias = [
  'Dirección estética con mirada estratégica',
  'Formación profesional + experiencia en moda',
  'Equipo que te acompaña de principio a fin',
  'Enfoque personalizado y sensible',
  'No vendemos moda: proyectamos imagen',
  'Trabajamos con nuevos talentos',
]

export default function QuienesSomos() {
  return (
    <section className={styles.section} data-nav="light">
      <div className="section-inner">
        <p className="section-label reveal">☆ Quiénes somos</p>

        <div className={styles.layout}>
          <div className={`${styles.left} reveal`}>
            <ScrambleHeading />
            <p className={styles.statement}>
              Somos Justina Porta y Lucila Beltramino, productoras de moda con formación en
              dirección de arte, producción de moda y contenido digital. Creamos MUDA como
              una productora creativa donde resolvemos de forma integral todo lo que necesitás
              para proyectar tu imagen.
            </p>
            <p className={styles.statement}>
              Nos mueve la estética con propósito, la estrategia visual y el deseo de
              acompañar a artistas, marcas y talentos a encontrar una identidad que los
              represente de verdad.
            </p>
            <ul className={styles.diff}>
              {diferencias.map(d => <li key={d}>{d}</li>)}
            </ul>
          </div>

          <div className={styles.bios}>
            <TiltCard className={`${styles.bioCard} reveal d1`}>
              <p className={styles.bioName}>Justina Porta</p>
              <p className={styles.bioAlias}>JOTTA</p>
              <p className={styles.bioText}>
                Desde hace cinco años dedicada al mundo de la moda, tanto profesional como
                académicamente. Formación en Dirección de Arte, Marketing y Comunicación,
                Fashion Business, Relaciones Públicas, Producción y Dirección. Especializada
                en producciones de foto y video, dirección creativa, diseño gráfico y estilismo.
                Su otra gran pasión es la música: videoclips, sesiones de fotos, asesoría en
                vestimenta y management de artistas.
              </p>
              <p className={styles.bioIg}>@jussttinaa</p>
            </TiltCard>

            <TiltCard className={`${styles.bioCard} reveal d2`}>
              <p className={styles.bioName}>Lucila Beltramino</p>
              <p className={styles.bioAlias}>LULI</p>
              <p className={styles.bioText}>
                Descubrió en la Producción de Moda un espacio donde volcar toda su creatividad.
                Estudió en Espacio Buenos Aires, participó en pasantías en BAFWEEK. Hoy estudia
                Relaciones Públicas en la Universidad de Palermo. Trabaja en un proyecto de
                management de artistas, explorando nuevas formas de unir estética, arte y
                comunicación. MUDA nació con sus amigas — la moda se vive más intensamente
                cuando se comparte.
              </p>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  )
}
