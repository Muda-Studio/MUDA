const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

export function imgUrl(publicId: string, opts = 'w_600,h_800,c_fill,q_auto,f_auto') {
  if (!publicId) return ''
  // Si ya es una URL completa, devolverla tal cual
  if (publicId.startsWith('http')) return publicId
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${opts}/${publicId}`
}

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    { method: 'POST', body: fd }
  )
  const data = await res.json()
  return data.secure_url as string
}

// Sube imagen O video (endpoint auto). Devuelve la secure_url
// (para video queda con /video/upload/…mp4, así se puede detectar).
export async function uploadMedia(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`,
    { method: 'POST', body: fd }
  )
  const data = await res.json()
  if (data.error) throw new Error(data.error.message || 'Error al subir')
  return data.secure_url as string
}

export const isVideo = (u: string) =>
  /\/video\/upload\//.test(u) || /\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(u)
