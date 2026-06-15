import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.row}>
        <span className={styles.logo}>MUDA</span>
        <div className={styles.texts}>
          <p>Productora Creativa — Buenos Aires © {new Date().getFullYear()}</p>
          <p>Dirección estética &amp; producción de imagen</p>
        </div>
      </div>
      <p className={styles.credit}>
        Developed by{' '}
        <a href="https://www.instagram.com/giulianna.dev" target="_blank" rel="noopener">
          @giulianna.dev
        </a>
      </p>
    </footer>
  )
}
