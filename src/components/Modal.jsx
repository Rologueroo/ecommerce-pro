import { useEffect, useRef } from 'react';
import Button from './Button';

// Ventana modal reutilizable (carrito, formulario de producto, confirmaciones).
// - Se cierra con Escape, con el botón de cerrar o haciendo clic en el fondo.
// - Bloquea el scroll de la página mientras está abierta.
export default function Modal({ title, onClose, children, footer, wide = false }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  // Guardamos siempre la última versión de onClose sin reiniciar los efectos.
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className={`modal ${wide ? 'modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
      >
        <header className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar">
            ✕
          </Button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}
