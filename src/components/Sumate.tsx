import { useState, useRef } from 'react'
import type { View } from '../App'
import { supabase, type Categoria } from '../lib/supabase'
import { uploadImage, imgUrl } from '../lib/cloudinary'
import styles from './Sumate.module.css'

type Props = { navigate: (v: View) => void }

const CATS: { key: Categoria; label: string }[] = [
  { key: 'modelos',       label: 'Modelo' },
  { key: 'fotografos',    label: 'Fotógrafx' },
  { key: 'maquilladores', label: 'Maquilladorx' },
]

const EMPTY = {
  nombre: '', edad: '', categoria: 'modelos' as Categoria,
  altura: '', hombros: '', busto: '', busto_label: 'Busto', cintura: '', cadera: '',
  talle_ropa: '', talle_pantalon: '', talle_calzado: '', pelo: '', ojos: '', ubicacion: '', formacion: '',
  estilo: '', contacto: '',
  portada_1: '', portada_2: '', galeria: [] as string[],
}

/* ── Upload foto ───────────────────────────────────────────── */
function FotoUpload({ url, onUrl }: { url: string; onUrl: (u: string) => void }) {
  const [busy, setBusy]    = useState(false)
  const [preview, setPrev] = useState<string | null>(null)
  const ref = useRef<HTMLInputElement>(null)

  const handle = async (file: File) => {
    const local = URL.createObjectURL(file)
    setPrev(local); setBusy(true)
    try { onUrl(await uploadImage(file)) }
    finally { setBusy(false); URL.revokeObjectURL(local); setPrev(null) }
  }

  const shown = preview ?? (url ? imgUrl(url, 'w_400,h_520,c_fill,q_auto') : null)

  return (
    <div className={styles.foto} onClick={() => !busy && ref.current?.click()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); if (busy) return; const f = e.dataTransfer.files[0]; if (f) handle(f) }}>
      <input ref={ref} type="file" accept="image/*" hidden
        onChange={e => { const f = e.target.files?.[0]; if (f) handle(f) }} />
      {shown ? <img src={shown} alt="" className={styles.fotoImg} /> : <span className={styles.fotoPlus}>+</span>}
      {busy && (
        <div className={styles.fotoLoad}>
          <span className={styles.spinner} /> Subiendo…
        </div>
      )}
    </div>
  )
}

export default function Sumate({ navigate }: Props) {
  const [f, setF]       = useState(EMPTY)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const galRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF(p => ({ ...p, [k]: e.target.value }))

  const isModelo = f.categoria === 'modelos'

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    const { edad, ...rest } = f
    await supabase.from('solicitudes').insert({
      ...rest,
      edad: edad ? parseInt(edad) : null,
    })
    setSending(false)
    setDone(true)
  }

  if (done) {
    return (
      <section className={styles.section} data-nav="light">
        <div className={styles.doneWrap}>
          <span className={styles.doneStar}>☆</span>
          <h1 className={styles.doneTitle}>¡Recibimos<br /><em>tu solicitud!</em></h1>
          <p className={styles.doneText}>
            Vamos a revisar tu perfil y te contactamos pronto.
            Gracias por querer ser parte de MUDA.
          </p>
          <button className={styles.btnDark} onClick={() => navigate('inicio')}>Volver al inicio</button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section} data-nav="light">
      <div className={styles.inner}>
        <p className={styles.label}>☆ Sumate a la base</p>
        <h1 className={styles.title}>Formá parte<br /><em>de MUDA.</em></h1>
        <p className={styles.intro}>
          Completá tus datos para entrar a nuestra base de talentos. No pasa nada si nunca
          posaste o recién empezás — lo revisamos y te contactamos.
        </p>

        <form className={styles.form} onSubmit={submit}>

          {/* Categoría */}
          <div className={styles.field}>
            <label>¿Qué hacés?</label>
            <div className={styles.cats}>
              {CATS.map(c => (
                <button key={c.key} type="button"
                  className={`${styles.cat} ${f.categoria === c.key ? styles.catActive : ''}`}
                  onClick={() => setF(p => ({ ...p, categoria: c.key }))}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nombre + edad */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label>Nombre completo</label>
              <input className={styles.input} value={f.nombre} onChange={set('nombre')} required placeholder="Tu nombre" />
            </div>
            <div className={styles.field}>
              <label>Edad</label>
              <input className={styles.input} type="number" value={f.edad} onChange={set('edad')} placeholder="24" min={0} max={99} />
            </div>
          </div>

          {/* Modelos */}
          {isModelo ? (
            <>
              <div className={styles.row3}>
                <div className={styles.field}><label>Altura</label><input className={styles.input} value={f.altura} onChange={set('altura')} placeholder="1,73 m" /></div>
                <div className={styles.field}><label>Pelo</label><input className={styles.input} value={f.pelo} onChange={set('pelo')} placeholder="Castaño" /></div>
                <div className={styles.field}><label>Ojos</label><input className={styles.input} value={f.ojos} onChange={set('ojos')} placeholder="Marrones" /></div>
              </div>
              <div className={styles.field}>
                <label>Medidas <span className={styles.hint}>en cm</span></label>
                <div className={styles.row4}>
                  <input className={styles.input} value={f.hombros} onChange={set('hombros')} placeholder="Hombros" />
                  <div>
                    <div className={styles.bustoToggle}>
                      {(['Busto', 'Pecho'] as const).map(opt => (
                        <button key={opt} type="button"
                          className={`${styles.bustoOpt} ${f.busto_label === opt ? styles.bustoOptActive : ''}`}
                          onClick={() => setF(p => ({ ...p, busto_label: opt }))}>
                          {opt}
                        </button>
                      ))}
                    </div>
                    <input className={styles.input} value={f.busto} onChange={set('busto')} placeholder={f.busto_label} />
                  </div>
                  <input className={styles.input} value={f.cintura} onChange={set('cintura')} placeholder="Cintura" />
                  <input className={styles.input} value={f.cadera}  onChange={set('cadera')}  placeholder="Cadera" />
                </div>
              </div>
              <div className={styles.row3}>
                <div className={styles.field}><label>Talle remera</label><input className={styles.input} value={f.talle_ropa} onChange={set('talle_ropa')} placeholder="M" /></div>
                <div className={styles.field}><label>Talle pantalón</label><input className={styles.input} value={f.talle_pantalon} onChange={set('talle_pantalon')} placeholder="38" /></div>
                <div className={styles.field}><label>Calzado</label><input className={styles.input} value={f.talle_calzado} onChange={set('talle_calzado')} placeholder="38" /></div>
              </div>
              <div className={styles.row2eq}>
                <div className={styles.field}>
                  <label>Ubicación</label>
                  <input className={styles.input} value={f.ubicacion} onChange={set('ubicacion')} placeholder="CABA · Zona Sur…" />
                </div>
                <div className={styles.field}>
                  <label>Formación / Experiencia <span className={styles.hint}>opcional</span></label>
                  <input className={styles.input} value={f.formacion} onChange={set('formacion')} placeholder="Multitalent, pasarela, editoriales…" />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.field}>
              <label>Contanos sobre tu trabajo</label>
              <textarea className={styles.textarea} rows={4} value={f.estilo} onChange={set('estilo')}
                placeholder="Tu estilo, especialidad, experiencia…" />
            </div>
          )}

          {/* Contacto */}
          <div className={styles.field}>
            <label>Tu contacto <span className={styles.hint}>email o teléfono para responderte</span></label>
            <input className={styles.input} value={f.contacto} onChange={set('contacto')} required placeholder="email@ejemplo.com / +54 9 11…" />
          </div>

          {/* Fotos */}
          <div className={styles.field}>
            <label>Fotos de portada <span className={styles.hint}>2 fotos tuyas</span></label>
            <div className={styles.portadas}>
              <FotoUpload url={f.portada_1} onUrl={u => setF(p => ({ ...p, portada_1: u }))} />
              <FotoUpload url={f.portada_2} onUrl={u => setF(p => ({ ...p, portada_2: u }))} />
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.galHead}>
              <label>Galería <span className={styles.hint}>{f.galeria.length}/6 — opcional</span></label>
              {f.galeria.length < 6 && (
                <button type="button" className={styles.galAdd} onClick={() => galRef.current?.click()}>+ Agregar</button>
              )}
              <input ref={galRef} type="file" accept="image/*" multiple hidden
                onChange={async e => {
                  const files = Array.from(e.target.files ?? []).slice(0, 6 - f.galeria.length)
                  for (const file of files) {
                    const u = await uploadImage(file)
                    setF(p => ({ ...p, galeria: [...p.galeria, u] }))
                  }
                  e.target.value = ''
                }} />
            </div>
            <div className={styles.galGrid}>
              {f.galeria.map((u, i) => (
                <div key={i} className={styles.galThumb}>
                  <img src={imgUrl(u, 'w_160,h_200,c_fill,q_auto')} alt="" />
                  <button type="button" className={styles.galX}
                    onClick={() => setF(p => ({ ...p, galeria: p.galeria.filter((_, idx) => idx !== i) }))}>✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnGhost} onClick={() => navigate('inicio')}>Cancelar</button>
            <button type="submit" className={styles.btnDark} disabled={sending || !f.nombre || !f.contacto}>
              {sending ? 'Enviando…' : 'Enviar solicitud →'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
