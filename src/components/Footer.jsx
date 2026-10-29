import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong className="footer-brand">Ecommerce Pro</strong>
          <p>Proyecto integrador hecho con React, React Router y LocalStorage.</p>
        </div>
        <nav className="footer-links" aria-label="Enlaces del pie">
          <Link to="/">Catálogo</Link>
          <Link to="/about">Nosotros</Link>
          {isLoggedIn ? (
            <Link to="/wishlist">Mi lista de deseos</Link>
          ) : (
            <>
              <Link to="/login">Ingresar</Link>
              <Link to="/register">Crear cuenta</Link>
            </>
          )}
        </nav>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Ecommerce Pro · Compra simulada, sin pagos reales.</p>
    </footer>
  );
}
