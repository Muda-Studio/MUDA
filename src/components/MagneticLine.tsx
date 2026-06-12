import { useRef } from 'react'

/* Una línea de título con efecto magnético: cada letra se aparta del cursor.
   - Uso simple:   <MagneticLine text="Hablemos de" />
   - En itálica:   <MagneticLine text="proyecto." italic />
   - Mezcla (parte normal + parte bordó en itálica) dentro de una misma línea:
       <MagneticLine segments={[{ text: 'Base de ' }, { text: 'talentos.', italic: true }]} />
   Las líneas se apilan (cada <MagneticLine> es un bloque). El <em> hereda el
   color bordó de los estilos del título, igual que antes.                       */

type Segment = { text: string; italic?: boolean }

export default function MagneticLine({
  text,
  italic,
  segments,
}: {
  text?: string
  italic?: boolean
  segments?: Segment[]
}) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const segs: Segment[] = segments ?? [{ text: text ?? '', italic }]

  const onMove = (e: React.MouseEvent) => {
    refs.current.forEach(span => {
      if (!span) return
      const r = span.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
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

  // índice global de letra dentro de la línea (para los refs)
  let idx = 0
  const renderChars = (str: string) =>
    str.split('').map(ch => {
      const i = idx++
      return (
        <span
          key={i}
          ref={el => { refs.current[i] = el }}
          style={{ display: 'inline-block', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' }}
        >
          {/* espacio no-rompible: en inline-block un espacio normal se colapsa */}
          {ch === ' ' ? String.fromCharCode(160) : ch}
        </span>
      )
    })

  return (
    <span style={{ display: 'block' }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {segs.map((s, si) =>
        s.italic
          ? <em key={si}>{renderChars(s.text)}</em>
          : <span key={si}>{renderChars(s.text)}</span>
      )}
    </span>
  )
}
