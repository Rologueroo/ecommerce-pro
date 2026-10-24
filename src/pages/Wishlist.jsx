import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export default function Wishlist() {
  const { currentUser } = useAuth();
  const { products } = useShop();

  // La lista guarda solo ids; buscamos los productos reales (si se borró alguno, desaparece).
  const wished = products.filter((product) => currentUser.wishlist.includes(product.id));

  return (
    <>
      <h1>Mis deseos</h1>
      {wished.length > 0 ? (
        <div className="grid">
          {wished.map((product) => <Card key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="empty-block">
          <p>Tu lista está vacía. Tocá el corazón de un producto para guardarlo.</p>
          <Link to="/" className="btn btn-primary">Ir al catálogo</Link>
        </div>
      )}
    </>
  );
}
