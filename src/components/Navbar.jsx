import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import CartModal from './CartModal';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function Navbar() {
  const { currentUser, isLoggedIn, isAdmin, roleLabel, logout } = useAuth();
  const { cartCount } = useShop();
  const [menuOpen, setMenuOpen] = useState(false); // menú hamburguesa (celulares)
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  function handleLogout() {
    logout();
    closeMenu();
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          Ecommerce Pro
        </Link>

        <button
          type="button"
          className="burger"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>Catálogo</NavLink>
          <NavLink to="/about" className={linkClass} onClick={closeMenu}>Nosotros</NavLink>
          {isLoggedIn && <NavLink to="/wishlist" className={linkClass} onClick={closeMenu}>Mis deseos</NavLink>}
          {isAdmin && <NavLink to="/admin" className={linkClass} onClick={closeMenu}>Administración</NavLink>}

          <div className="nav-actions">
            {/* Identifica si quien navega es Invitado, Usuario o Administrador */}
            <span className={`role role-${roleLabel.toLowerCase()}`}>
              {currentUser && !isAdmin ? `${currentUser.name} · ${roleLabel}` : roleLabel}
            </span>

            <Button variant="secondary" size="sm" onClick={() => { setCartOpen(true); closeMenu(); }}>
              Carrito ({cartCount})
            </Button>

            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>Salir</Button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={closeMenu}>Ingresar</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>Registrarme</Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {cartOpen && <CartModal onClose={() => setCartOpen(false)} />}
    </header>
  );
}
