import { useRef, useState } from 'react'
import styles from './Estudio.module.css'
import { imgUrl } from '../lib/cloudinary'

const features = [
  { title: 'Sala Infinito', desc: 'Sala principal tipo infinito de cuatro paredes. Ideal para sesiones de fotos, campañas de moda, creación de contenido y producciones comerciales.' },
  { title: 'Salas múltiples', desc: 'Salas de usos múltiples adaptables a cada proyecto: vestuario, reuniones de producción, maquillaje o espacios de trabajo.' },
  { title: 'Catering incluido', desc: 'El servicio de alquiler incluye catering para el equipo de trabajo, brindando mayor comodidad durante la jornada.' },
  { title: 'Servicios add-on', desc: 'Posibilidad de sumar maquilladora y fotógrafe profesional, a criterio y preferencia de cada cliente.' },
]

/* Galería del estudio — las fotos viven en Cloudinary (no ocupan espacio en el repo).
   Para cambiar/agregar fotos: subí cada imagen a Cloudinary dentro de la carpeta
   "estudio" con el nombre (public_id) que figura en cada 'id' de abajo.
   Cloudinary las optimiza y sirve por CDN automáticamente.
   - shape 'tall'  → ocupa alto doble (foto vertical / hero)
   - shape 'wide'  → ocupa ancho completo (foto apaisada)
   - sin shape     → celda cuadrada normal */
const photos: { id: string; label: string; shape?: 'tall' | 'wide' }[] = [
  { id: 'espacio1_wmgx1f',  label: 'Sala Infinito', shape: 'tall' },
  { id: 'espacio2_b7rpbk',  label: 'El set' },
  { id: 'espacio3_wiwpo3',  label: 'El espacio' },
  { id: 'espacio4_xggrbc',  label: 'Estudio' },
  { id: 'espacio66_rbymzi', label: 'Palermo' },
  { id: 'espacio5_fqt5ug',  label: 'Vista general', shape: 'wide' },
]

export default function Estudio() {
  const visualRef = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)
  const [broken, setBroken] = useState<Record<string, boolean>>({})

  const onMove = (e: React.MouseEvent) => {
    const vis = visualRef.current
    const grid = gridRef.current
    if (!vis || !grid) return
    const r = vis.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 8
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 8
    grid.style.transition = 'transform 0.15s linear'
    grid.style.transform = `perspective(1100px) rotateY(${x}deg) rotateX(${-y}deg)`
  }

  const onLeave = () => {
    if (!gridRef.current) return
    gridRef.current.style.transition = 'transform 0.9s cubic-bezier(0.16,1,0.3,1)'
    gridRef.current.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg)'
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
          <div ref={gridRef} className={`${styles.gallery} reveal`}>
            {photos.map((p, i) => {
              const opts =
                p.shape === 'tall' ? 'w_640,h_900,c_fill,q_auto,f_auto'
              : p.shape === 'wide' ? 'w_900,h_460,c_fill,q_auto,f_auto'
              :                      'w_560,h_560,c_fill,q_auto,f_auto'
              return (
                <figure
                  key={p.id}
                  className={[
                    styles.cell,
                    p.shape === 'tall' ? styles.tall : '',
                    p.shape === 'wide' ? styles.wide : '',
                    broken[p.id] ? styles.empty : '',
                  ].join(' ')}
                  style={{ ['--d' as string]: `${i * 70}ms` }}
                >
                  <img
                    src={imgUrl(p.id, opts)}
                    alt={`Estudio MUDA — ${p.label}`}
                    loading="lazy"
                    className={styles.cellImg}
                    onError={() => setBroken(b => ({ ...b, [p.id]: true }))}
                  />
                  <figcaption className={styles.cellLabel}>{p.label}</figcaption>
                </figure>
              )
            })}
          </div>
          <p className={`${styles.note} reveal d2`}>Estudio Palermo · Buenos Aires</p>
        </div>
      </div>
    </section>
  )
}
