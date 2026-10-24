import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import ProductForm from './ProductForm';
import { useShop } from '../context/ShopContext';
import { formatPrice, handleImageError } from '../utils/format';

// Tabla CRUD de productos. `editing` puede ser: null (nada), 'new' (alta) o un producto (edición).
export default function ProductsTable() {
  const { products, deleteProduct } = useShop();
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  return (
    <section>
      <div className="section-head">
        <h2>Productos ({products.length})</h2>
        <Button onClick={() => setEditing('new')}>Nuevo producto</Button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Imagen</th><th>Código</th><th>Nombre</th><th>Categoría</th>
              <th>Precio</th><th>Stock</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td><img className="thumb" src={product.image} alt="" onError={handleImageError} /></td>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{formatPrice(product.price)}</td>
                <td className={product.stock === 0 ? 'stock-out' : ''}>{product.stock}</td>
                <td className="row-actions">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(product)}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => setToDelete(product)}>Borrar</Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="7" className="empty">No hay productos. Agregá el primero.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Nuevo producto' : 'Editar producto'} onClose={() => setEditing(null)} wide>
          <ProductForm
            product={editing === 'new' ? null : editing}
            onSaved={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {toDelete && (
        <Modal
          title="Borrar producto"
          onClose={() => setToDelete(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setToDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={() => { deleteProduct(toDelete.id); setToDelete(null); }}>
                Sí, borrar
              </Button>
            </>
          }
        >
          <p>¿Querés borrar <strong>{toDelete.name}</strong>? Esta acción no se puede deshacer.</p>
        </Modal>
      )}
    </section>
  );
}
