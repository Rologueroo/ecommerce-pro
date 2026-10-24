import { useState } from 'react';
import ProductsTable from '../components/ProductsTable';
import UsersTable from '../components/UsersTable';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

// Esta página solo se muestra si ProtectedRoute confirmó que el usuario es administrador.
export default function Admin() {
  const [tab, setTab] = useState('products');
  const { products } = useShop();
  const { users } = useAuth();
  const soldOut = products.filter((product) => product.stock === 0).length;

  return (
    <>
      <h1>Panel de administración</h1>

      <dl className="stats">
        <div><dt>Productos</dt><dd>{products.length}</dd></div>
        <div><dt>Sin stock</dt><dd>{soldOut}</dd></div>
        <div><dt>Usuarios</dt><dd>{users.length}</dd></div>
      </dl>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'products'} className={tab === 'products' ? 'tab tab-on' : 'tab'} onClick={() => setTab('products')}>
          Productos
        </button>
        <button role="tab" aria-selected={tab === 'users'} className={tab === 'users' ? 'tab tab-on' : 'tab'} onClick={() => setTab('users')}>
          Usuarios
        </button>
      </div>

      {tab === 'products' ? <ProductsTable /> : <UsersTable />}
    </>
  );
}
