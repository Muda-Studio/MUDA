import MagneticLine from './MagneticLine'
import styles from './ProduccionServicio.module.css'

const incluye = [
  'Desarrollo del concepto visual',
  'Moodboards',
  'Coordinación y ejecución estética',
  'Acompañamiento creativo desde la idea inicial',
  'Dirección visual del proyecto',
]

const noIncluye = [
  'Producción ni gestión de recursos humanos',
  'Materiales necesarios para la realización',
]

export default function ProduccionCreativa() {
  return (
    <section className={styles.section} data-nav="light">
      <div className={styles.inner}>

        <div className={styles.header}>
          <span className={styles.num}>02</span>
          <p className={styles.label}>Producción</p>
        </div>

        <h1 className={styles.heading}>
          <MagneticLine text="Dirección" />
          <MagneticLine text="Creativa" />
          <MagneticLine text="Visual." italic />
        </h1>

        <div className={styles.body}>
          <div className={styles.col}>
            <p className={styles.lead}>
              Nos especializamos en la conceptualización estética y visual de
              campañas, videoclips y perfiles.
            </p>
            <p className={styles.text}>
              Nuestro trabajo consiste en acompañarte creativamente desde tu idea
              inicial, para desarrollar juntos la propuesta visual del proyecto que
              estés realizando.
            </p>
            <p className={styles.text}>
              Nuestra función es ser tu <strong>soporte creativo</strong>: pensar,
              dirigir y construir visualmente el proyecto con vos.
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

            <p className={styles.incluye} style={{ marginTop: '2rem' }}>No incluye</p>
            <ul className={styles.list}>
              {noIncluye.map(item => (
                <li key={item} style={{ opacity: 0.5 }}>
                  <span className={styles.dotOff} />
                  {item}
                </li>
              ))}
            </ul>

            <div className={styles.nota}>
              <p>
                Para producción y gestión de recursos humanos,
                ver Servicio 01: Producción de fotos & video.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
