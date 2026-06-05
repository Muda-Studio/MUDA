import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove)

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15
      if (cursorRef.current) {
        // translate3d → compositor (GPU), sin reflow
        cursorRef.current.style.transform =
          `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }
      raf.current = requestAnimationFrame(animate)
    }
    raf.current = requestAnimationFrame(animate)

    const onEnter = () => setHovering(true)
    const onLeave = () => setHovering(false)
    const targets = document.querySelectorAll('a, button, .talent-card, .servicio-card')
    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${hovering ? styles.hovering : ''}`}
    >
      <div className={styles.inner}>
        <img src="/estrella.svg" alt="" className={styles.star} draggable={false} />
      </div>
    </div>
  )
}
