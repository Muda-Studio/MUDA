import MagneticLine from './MagneticLine'
import styles from './ProduccionServicio.module.css'

const incluye = [
  'Maquilladorx',
  'Peinadorx',
  'Fotógrafx',
  'Búsqueda de locación (estudio o calle)',
  'Dirección de arte — armado del espacio visual / escenografía',
  'Estilismo y asesoría de ropa',
]

export default function ProduccionFoto() {
  return (
    <section className={styles.section} data-nav="light">
      <div className={styles.inner}>

        <div className={styles.header}>
          <span className={styles.num}>01</span>
          <p className={styles.label}>Producción</p>
        </div>

        <h1 className={styles.heading}>
          <MagneticLine text="Producción" />
          <MagneticLine text="de fotos" />
          <MagneticLine text="& video." italic />
        </h1>

        <div className={styles.body}>
          <div className={styles.col}>
            <p className={styles.lead}>
              Ofrecemos el servicio integral de producción y dirección. Nos encargamos
              de organizar, planificar y producir tu shooting de principio a fin.
            </p>
            <p className={styles.text}>
              Si ya contás con maquillaje, peinado, fotografía o algún otro elemento,
              solo contratás lo que es la <strong>producción y dirección</strong> — nosotras
              nos ocupamos del resto.
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

            <div className={styles.nota}>
              <p>
                Podés contratar el servicio completo o solo los componentes
                que necesitás según tu proyecto.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
