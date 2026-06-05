// El número se configura en .env como VITE_WHATSAPP
// Formato internacional sin + ni espacios. Ej: 5491155551234
export const WHATSAPP = (import.meta.env.VITE_WHATSAPP as string) || ''

export const whatsappLink = (mensaje: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`
