import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  // El carrito manda acá a los invitados que intentan finalizar la compra.
  const guestCheckout = useLocation().state?.reason === 'guest-checkout';

  if (guestCheckout) {
    return (
      <div className="not-found">
        <p className="big-404">404</p>
        <h1>Para comprar necesitás una cuenta</h1>
        <p className="muted">Como invitado podés armar el carrito, pero la compra solo la finalizan usuarios registrados. Tu carrito queda guardado.</p>
        <div className="not-found-actions">
          <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
          <Link to="/register" className="btn btn-secondary">Crear cuenta</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="not-found">
      <p className="big-404">404</p>
      <h1>No encontramos esa página</h1>
      <p className="muted">El enlace puede estar roto o no tenés permiso para verla.</p>
      <Link to="/" className="btn btn-primary">Volver al catálogo</Link>
    </div>
  );
}
