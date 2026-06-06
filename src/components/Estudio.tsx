import { useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import styles from './Estudio.module.css'
import { imgUrl } from '../lib/cloudinary'
import { estudioFotos, ESTUDIO_FX } from '../lib/estudioFotos'

const pic = (id: string) =>
  imgUrl(id, `${ESTUDIO_FX},w_900,h_1240,c_fill,g_auto,q_auto,f_auto`)

const features = [
  ['Sala Infinito', 'Sala principal tipo infinito de cuatro paredes.'],
  ['Salas múltiples', 'Vestuario, reuniones, maquillaje o espacios de trabajo.'],
  ['Catering incluido', 'Para el equipo durante toda la jornada.'],
  ['Servicios add-on', 'Maquilladora y fotógrafe profesional opcionales.'],
]

const pad = (n: number) => String(n).padStart(2, '0')

// los tipos de react-pageflip marcan todas las props como requeridas; lo usamos laxo
const FlipBook = HTMLFlipBook as unknown as React.ComponentType<any>

export default function Estudio() {
  const book = useRef<any>(null)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)

  const flip = (dir: number) => {
    const pf = book.current?.pageFlip?.()
    if (!pf) return
    dir > 0 ? pf.flipNext() : pf.flipPrev()
  }

  // páginas de foto (después de portada + intro)
  const fotoPages = estudioFotos.slice(1) // 5 fotos interiores

  return (
    <section className={styles.section} data-nav="dark">
      <div className={styles.head}>
        <p className={`${styles.kicker} reveal`}>☆ Estudio</p>
        <h2 className={`${styles.title} reveal d1`}>La <em>revista</em><br />del espacio.</h2>
        <p className={`${styles.hint} reveal d2`}>↗ Arrastrá la esquina para pasar de página</p>
      </div>

      <div className={styles.stage}>
        <button className={`${styles.nav} ${styles.prev}`} onClick={() => flip(-1)} aria-label="Anterior">←</button>

        <FlipBook
          ref={book}
          width={470}
          height={640}
          size="stretch"
          minWidth={300}
          maxWidth={540}
          minHeight={400}
          maxHeight={760}
          showCover
          drawShadow
          maxShadowOpacity={0.35}
          flippingTime={750}
          mobileScrollSupport
          className={styles.book}
          onFlip={(e: any) => setPage(e.data)}
          onInit={(e: any) => setTotal(e.object?.getPageCount?.() ?? 0)}
        >
          {/* ── PORTADA ── */}
          <div className={`${styles.page} ${styles.cover}`} data-density="hard">
            <img src={pic(estudioFotos[0].id)} className={styles.coverImg} alt="" />
            <div className={styles.coverShade} />
            <div className={styles.coverInner}>
              <p className={styles.mast}>MUDA</p>
              <div className={styles.coverBottom}>
                <h3 className={styles.coverTitle}>El<br /><em>Estudio</em></h3>
                <p className={styles.coverSub}>Nº 01 — Palermo, Buenos Aires</p>
              </div>
            </div>
          </div>

          {/* ── INTRO (texto) ── */}
          <div className={`${styles.page} ${styles.paper}`}>
            <div className={styles.paperInner}>
              <p className={styles.section_n}>El espacio</p>
              <p className={styles.intro}>
                <span className={styles.drop}>E</span>n MUDA contamos con un espacio en
                Palermo pensado para producciones fotográficas, audiovisuales y proyectos
                creativos de todo tipo.
              </p>
              <p className={styles.introSm}>
                Sala infinito de cuatro paredes · salas múltiples · catering incluido ·
                servicios add-on.
              </p>
            </div>
            <span className={styles.folio}>02</span>
          </div>

          {/* ── FOTO 1 ── */}
          <div className={`${styles.page} ${styles.photoPage}`}>
            <img src={pic(fotoPages[0].id)} className={styles.pageImg} alt={fotoPages[0].label} />
            <span className={styles.cap}>{fotoPages[0].label}</span>
          </div>

          {/* ── FOTO 2 ── */}
          <div className={`${styles.page} ${styles.photoPage}`}>
            <img src={pic(fotoPages[1].id)} className={styles.pageImg} alt={fotoPages[1].label} />
            <span className={styles.cap}>{fotoPages[1].label}</span>
          </div>

          {/* ── FEATURES (texto) ── */}
          <div className={`${styles.page} ${styles.paper}`}>
            <div className={styles.paperInner}>
              <p className={styles.section_n}>Lo que incluye</p>
              <ul className={styles.featList}>
                {features.map(([t, d]) => (
                  <li key={t} className={styles.featItem}>
                    <span className={styles.featT}>{t}</span>
                    <span className={styles.featD}>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            <span className={styles.folio}>05</span>
          </div>

          {/* ── FOTO 3 ── */}
          <div className={`${styles.page} ${styles.photoPage}`}>
            <img src={pic(fotoPages[2].id)} className={styles.pageImg} alt={fotoPages[2].label} />
            <span className={styles.cap}>{fotoPages[2].label}</span>
          </div>

          {/* ── FOTO 4 ── */}
          <div className={`${styles.page} ${styles.photoPage}`}>
            <img src={pic(fotoPages[3].id)} className={styles.pageImg} alt={fotoPages[3].label} />
            <span className={styles.cap}>{fotoPages[3].label}</span>
          </div>

          {/* ── FOTO 5 ── */}
          <div className={`${styles.page} ${styles.photoPage}`}>
            <img src={pic(fotoPages[4].id)} className={styles.pageImg} alt={fotoPages[4].label} />
            <span className={styles.cap}>{fotoPages[4].label}</span>
          </div>

          {/* ── CONTRATAPA ── */}
          <div className={`${styles.page} ${styles.cover} ${styles.back}`} data-density="hard">
            <div className={styles.backInner}>
              <p className={styles.mast}>MUDA</p>
              <h3 className={styles.backTitle}>¿Reservás<br />tu <em>producción?</em></h3>
              <p className={styles.backSub}>Palermo, Buenos Aires</p>
              <p className={styles.backTag}>@muda.agcy</p>
            </div>
          </div>
        </FlipBook>

        <button className={`${styles.nav} ${styles.nextB}`} onClick={() => flip(1)} aria-label="Siguiente">→</button>
      </div>

      <p className={styles.counter}>{pad(Math.min(page + 1, total || 1))} / {pad(total || 9)}</p>
    </section>
  )
}
