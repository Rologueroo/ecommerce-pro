import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="big-404">404</p>
      <h1>No encontramos esa página</h1>
      <p className="muted">El enlace puede estar roto o no tenés permiso para verla.</p>
      <Link to="/" className="btn btn-primary">Volver al catálogo</Link>
    </div>
  );
}
