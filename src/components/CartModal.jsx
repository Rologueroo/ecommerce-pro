import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Button from './Button';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { formatPrice, handleImageError } from '../utils/format';

export default function CartModal({ onClose }) {
  const { isLoggedIn } = useAuth();
  const { cartItems, cartTotal, setCartQty, removeFromCart, clearCart, checkout } = useShop();
  const [purchased, setPurchased] = useState(false);
  const navigate = useNavigate();

  function handleCheckout() {
    // Comprar requiere una cuenta.
    if (!isLoggedIn) {
      onClose();
      return navigate('/login', { state: { from: '/' } });
    }
    checkout();
    setPurchased(true);
  }

  if (purchased) {
    return (
      <Modal title="Compra realizada" onClose={onClose} footer={<Button onClick={onClose}>Seguir comprando</Button>}>
        <p>¡Gracias por tu compra! Es una compra simulada: descontamos el stock y vaciamos el carrito.</p>
      </Modal>
    );
  }

  return (
    <Modal
      title="Tu carrito"
      onClose={onClose}
      footer={
        cartItems.length > 0 && (
          <>
            <strong className="cart-total">Total: {formatPrice(cartTotal)}</strong>
            <Button variant="secondary" onClick={clearCart}>Vaciar</Button>
            <Button onClick={handleCheckout}>Finalizar compra</Button>
          </>
        )
      }
    >
      {cartItems.length === 0 ? (
        <p className="empty">Todavía no agregaste productos.</p>
      ) : (
        <ul className="cart-list">
          {cartItems.map(({ product, qty }) => (
            <li key={product.id} className="cart-item">
              <img src={product.image} alt="" onError={handleImageError} />
              <div className="cart-info">
                <strong>{product.name}</strong>
                <span>{formatPrice(product.price)}</span>
              </div>
              <div className="qty">
                <Button variant="secondary" size="sm" onClick={() => setCartQty(product.id, qty - 1)} aria-label="Restar uno">−</Button>
                <span>{qty}</span>
                <Button variant="secondary" size="sm" disabled={qty >= product.stock} onClick={() => setCartQty(product.id, qty + 1)} aria-label="Sumar uno">+</Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFromCart(product.id)} aria-label={`Quitar ${product.name}`}>✕</Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
