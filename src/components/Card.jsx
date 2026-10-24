import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { formatPrice, handleImageError } from '../utils/format';

// Tarjeta de producto reutilizable: se usa en el catálogo y en la lista de deseos.
export default function Card({ product }) {
  const { currentUser, isLoggedIn, toggleWishlist } = useAuth();
  const { addToCart } = useShop();
  const navigate = useNavigate();

  const inWishlist = currentUser?.wishlist.includes(product.id) ?? false;
  const soldOut = product.stock === 0;

  function handleWishlist() {
    // La lista de deseos es personal: un invitado primero debe iniciar sesión.
    if (!isLoggedIn) return navigate('/login', { state: { from: '/' } });
    toggleWishlist(product.id);
  }

  return (
    <article className="card">
      <div className="card-media">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" onError={handleImageError} />
        </Link>
        <button
          type="button"
          className={`wish ${inWishlist ? 'wish-on' : ''}`}
          onClick={handleWishlist}
          aria-pressed={inWishlist}
          aria-label={inWishlist ? 'Quitar de la lista de deseos' : 'Agregar a la lista de deseos'}
        >
          {inWishlist ? '♥' : '♡'}
        </button>
      </div>

      <div className="card-body">
        <span className="tag">{product.category}</span>
        <h3 className="card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="price">{formatPrice(product.price)}</p>
        <p className={`stock ${soldOut ? 'stock-out' : ''}`}>
          {soldOut ? 'Sin stock' : `${product.stock} disponibles`}
        </p>
      </div>

      <div className="card-actions">
        <Link to={`/product/${product.id}`} className="btn btn-secondary btn-sm">
          Ver detalle
        </Link>
        <Button size="sm" disabled={soldOut} onClick={() => addToCart(product.id)}>
          Agregar
        </Button>
      </div>
    </article>
  );
}
