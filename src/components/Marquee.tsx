import styles from './Marquee.module.css'

const items = [
  'Artistas musicales', 'Creadores de contenido', 'Marcas de moda',
  'Proyectos editoriales', 'Nuevos talentos',
]

export default function Marquee() {
  const track = [...items, ...items]
  return (
    <div className={styles.strip}>
      <div className={styles.track}>
        {track.map((item, i) => (
          <>
            <span key={`item-${i}`}>{item}</span>
            <span key={`sep-${i}`} className={styles.sep}>☆</span>
          </>
        ))}
      </div>
    </div>
  )
}
