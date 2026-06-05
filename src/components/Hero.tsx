import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bgLines} />

      <svg className={styles.starBg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,2 61,38 98,38 68,60 79,95 50,73 21,95 32,60 2,38 39,38"
          fill="none" stroke="#c4825a" strokeWidth="0.4" />
        <polygon points="50,10 59,36 87,36 65,53 73,79 50,62 27,79 35,53 13,36 41,36"
          fill="none" stroke="#c4825a" strokeWidth="0.2" />
      </svg>

      <div className={styles.wordmark}>
        {['M','U','D','A'].map((letter, i) => (
          <span
            key={letter}
            className={styles.letter}
            style={{ animationDelay: `${0.1 + i * 0.12}s` }}
          >
            {letter}
          </span>
        ))}
      </div>

      <p className={styles.tagline}>Productora Creativa — Buenos Aires</p>
      <p className={styles.sub}>Dirección estética & producción de imagen</p>

      <div className={styles.scroll}>
        <div className={styles.scrollLine} />
        <span>Explorá</span>
      </div>
    </section>
  )
}
