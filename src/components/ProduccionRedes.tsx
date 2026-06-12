import MagneticLine from './MagneticLine'
import styles from './ProduccionServicio.module.css'

const incluye = [
  'Producción y dirección creativa de contenido',
  'Estrategia de presencia digital',
  'Desarrollo visual para redes sociales',
  'Enfoque en comunicación de marca',
  'Adaptado para artistas, marcas y creativos',
]

const clientes = [
  'Artistas musicales',
  'Creadores de contenido / influencers',
  'Nuevas marcas de moda',
  'Proyectos editoriales',
  'Personas que quieren profesionalizar su imagen',
]

export default function ProduccionRedes() {
  return (
    <section className={styles.section} data-nav="light">
      <div className={styles.inner}>

        <div className={styles.header}>
          <span className={styles.num}>03</span>
          <p className={styles.label}>Producción</p>
        </div>

        <h1 className={styles.heading}>
          <MagneticLine text="Contenido" />
          <MagneticLine text="para" />
          <MagneticLine text="Redes." italic />
        </h1>

        <div className={styles.body}>
          <div className={styles.col}>
            <p className={styles.lead}>
              Creación de contenido estratégico para tu presencia digital.
            </p>
            <p className={styles.text}>
              Producción y dirección creativa especialmente enfocada en
              comunicación y presencia en redes sociales para marcas,
              artistas y creativos.
            </p>
            <p className={styles.text}>
              El costo queda sujeto al proyecto: plazos, cantidad de personal,
              material y horas de trabajo. Todo servicio requiere reuniones de
              pre y post producción (virtuales o presenciales).
            </p>
            <a href="mailto:creativeagencymuda@gmail.com" className={styles.cta}>
              Consultar →
            </a>
          </div>

          <div className={styles.col}>
            <p className={styles.incluye}>Qué incluye</p>
            <ul className={styles.list}>
              {incluye.map(item => (
                <li key={item}>
                  <span className={styles.dot} />
                  {item}
                </li>
              ))}
            </ul>

            <p className={styles.incluye} style={{ marginTop: '2rem' }}>Clientes ideales</p>
            <ul className={styles.list}>
              {clientes.map(item => (
                <li key={item}>
                  <span className={styles.dot} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}
