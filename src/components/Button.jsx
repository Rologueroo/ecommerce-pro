// Botón reutilizable. Variantes: primary (rojo), secondary (borde), ghost (sin borde), danger.
// Tamaños: md (por defecto) y sm. Acepta cualquier prop de <button> (onClick, disabled, type...).
export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button type={type} className={`btn btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </button>
  );
}
