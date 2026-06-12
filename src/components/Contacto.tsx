import { useRef } from 'react'
import { whatsappLink } from '../lib/config'
import styles from './Contacto.module.css'

function MagneticLine({ text, italic }: { text: string; italic?: boolean }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  const onMove = (e: React.MouseEvent) => {
    refs.current.forEach(span => {
      if (!span) return
      const r = span.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width  / 2)
      const dy = e.clientY - (r.top  + r.height / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxD = 120
      if (dist < maxD) {
        const f = (maxD - dist) / maxD
        span.style.transform = `translate(${-dx * f * 0.5}px, ${-dy * f * 0.4}px)`
      } else {
        span.style.transform = ''
      }
    })
  }

  const onLeave = () => refs.current.forEach(s => { if (s) s.style.transform = '' })

  const inner = (
    <span style={{ display: 'block' }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          ref={el => { refs.current[i] = el }}
          style={{ display: 'inline-block', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' }}
        >
          {/* el espacio se renderiza como no-rompible para que no se colapse en inline-block */}
          {ch === ' ' ? String.fromCharCode(160) : ch}
        </span>
      ))}
    </span>
  )

  return italic ? <em>{inner}</em> : inner
}

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
