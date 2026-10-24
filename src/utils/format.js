// Precio en pesos argentinos, sin decimales: $ 48.900
export const formatPrice = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

// Quita tildes y pasa a minúsculas, para que "tecnologia" encuentre "Tecnología".
export const normalizeText = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/**
 * Genera un código único con un prefijo ("P" productos, "U" usuarios).
 * Usa la fecha actual (única en cada momento) más un dígito al azar,
 * y además comprueba que no exista ya en la lista recibida.
 */
export function generateId(prefix, existingIds) {
  let id;
  do {
    const time = Date.now().toString(36).toUpperCase();
    const extra = Math.floor(Math.random() * 36).toString(36).toUpperCase();
    id = `${prefix}-${time}${extra}`;
  } while (existingIds.includes(id));
  return id;
}

// Imagen de reemplazo si la URL de un producto no carga.
export const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">' +
      '<rect width="100%" height="100%" fill="#ececef"/>' +
      '<text x="50%" y="50%" fill="#8b8b95" font-family="sans-serif" font-size="24" text-anchor="middle">Sin imagen</text>' +
      '</svg>'
  );

// Si la imagen falla, ponemos la de reemplazo (y evitamos un bucle infinito).
export function handleImageError(event) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMG;
}
