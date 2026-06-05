import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.logo}>MUDA</span>
      <p>Productora Creativa — Buenos Aires © 2025</p>
      <p>Dirección estética & producción de imagen</p>
    </footer>
  )
}
