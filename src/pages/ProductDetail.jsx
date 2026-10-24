import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { formatPrice, handleImageError } from '../utils/format';

export default function ProductDetail() {
  const { id } = useParams(); // viene de la ruta /product/:id
  const { products, addToCart } = useShop();
  const { currentUser, isLoggedIn, toggleWishlist } = useAuth();
  const navigate = useNavigate();

  const product = products.find((item) => item.id === id);
  // Si el id no existe, mostramos la página de error.
  if (!product) return <Navigate to="/404" replace />;

  const soldOut = product.stock === 0;
  const inWishlist = currentUser?.wishlist.includes(product.id) ?? false;

  function handleWishlist() {
    if (!isLoggedIn) return navigate('/login', { state: { from: `/product/${product.id}` } });
    toggleWishlist(product.id);
  }

  return (
    <>
      <Link to="/" className="back">← Volver al catálogo</Link>
      <article className="detail">
        <img className="detail-img" src={product.image} alt={product.name} onError={handleImageError} />
        <div className="detail-info">
          <span className="tag">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="price price-lg">{formatPrice(product.price)}</p>
          <p className={`stock ${soldOut ? 'stock-out' : ''}`}>
            {soldOut ? 'Sin stock' : `Stock: ${product.stock} unidades`}
          </p>
          <p className="detail-desc">{product.description}</p>
          <p className="muted">Código: {product.id}</p>
          <div className="detail-actions">
            <Button disabled={soldOut} onClick={() => addToCart(product.id)}>Agregar al carrito</Button>
            <Button variant="secondary" onClick={handleWishlist} aria-pressed={inWishlist}>
              {inWishlist ? '♥ En mis deseos' : '♡ Agregar a deseos'}
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
