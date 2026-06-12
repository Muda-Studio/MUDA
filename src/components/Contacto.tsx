import { whatsappLink } from '../lib/config'
import MagneticLine from './MagneticLine'
import styles from './Contacto.module.css'

export default function Contacto() {
  return (
    <section className={styles.section} data-nav="light">
      <div className="section-inner">
        <p className="section-label reveal">☆ Contacto</p>

        <div className={styles.layout}>
          <div>
            <h2 className={`${styles.heading} reveal`}>
              <MagneticLine text="Hablemos de" />
              <MagneticLine text="tu proyecto." italic />
            </h2>
            <a
              href={whatsappLink('¡Hola MUDA! Quiero hablar sobre un proyecto.')}
              target="_blank"
              rel="noopener"
              className={`${styles.cta} reveal d1`}
            >
              <span>Escribinos por WhatsApp →</span>
            </a>
          </div>

          <div className={styles.info}>
            {[
              { label: 'Email', value: 'creativeagencymuda@gmail.com', href: 'mailto:creativeagencymuda@gmail.com' },
              { label: 'Teléfono', value: '+54 9 11 5523-2004', href: whatsappLink('¡Hola MUDA!') },
              { label: 'Instagram', value: '@muda.agcy', href: 'https://www.instagram.com/muda.agcy' },
              { label: 'Ubicación', value: 'Palermo, Buenos Aires, ARG' },
              { label: 'Fundadoras', value: 'Justina Porta & Lucila Beltramino' },
            ].map((item, i) => (
              <div key={item.label} className={`${styles.item} reveal`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <label>{item.label}</label>
                {item.href
                  ? <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener">{item.value}</a>
                  : <span>{item.value}</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
