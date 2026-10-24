// Cada validador devuelve un objeto de errores: { campo: 'mensaje' }.
// Si el objeto está vacío, el formulario es válido.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateRegister({ name, email, password, confirm }, users) {
  const errors = {};
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) errors.name = 'Ingresá tu nombre.';
  else if (cleanName.length < 2) errors.name = 'El nombre debe tener al menos 2 caracteres.';

  if (!cleanEmail) errors.email = 'Ingresá tu email.';
  else if (!EMAIL_REGEX.test(cleanEmail)) errors.email = 'El email no tiene un formato válido.';
  else if (users.some((user) => user.email === cleanEmail)) errors.email = 'Ya existe una cuenta con ese email.';

  if (!password) errors.password = 'Ingresá una contraseña.';
  else if (password.length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
    errors.password = 'La contraseña debe combinar letras y números.';

  if (confirm !== password) errors.confirm = 'Las contraseñas no coinciden.';

  return errors;
}

// Los campos del formulario llegan como texto, por eso los convertimos acá.
export function validateProduct({ name, price, stock, category, image, description }) {
  const errors = {};

  if (!name.trim()) errors.name = 'El nombre es obligatorio.';
  else if (name.trim().length < 3) errors.name = 'El nombre debe tener al menos 3 caracteres.';

  if (price === '' || Number.isNaN(Number(price))) errors.price = 'Ingresá un precio numérico.';
  else if (Number(price) <= 0) errors.price = 'El precio debe ser mayor que 0.';

  if (stock === '' || Number.isNaN(Number(stock))) errors.stock = 'Ingresá el stock.';
  else if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
    errors.stock = 'El stock debe ser un número entero, 0 o mayor.';

  if (!category.trim()) errors.category = 'La categoría es obligatoria.';

  if (!image.trim()) errors.image = 'La URL de la imagen es obligatoria.';
  else if (!isValidUrl(image.trim())) errors.image = 'Ingresá una URL válida que empiece con http:// o https://';

  if (!description.trim()) errors.description = 'La descripción es obligatoria.';
  else if (description.trim().length < 10) errors.description = 'La descripción debe tener al menos 10 caracteres.';

  return errors;
}
