import { useMemo, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useShop } from '../context/ShopContext';
import { normalizeText } from '../utils/format';

export default function Catalog() {
  const { products, categories } = useShop();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');

  // Los filtros se recalculan en cada cambio (tiempo real) y se memorizan
  // para no repetir el trabajo si no cambió ni la búsqueda ni los productos.
  const filtered = useMemo(() => {
    const search = normalizeText(query.trim());
    return products.filter(
      (product) =>
        (category === 'Todas' || product.category === category) &&
        // La búsqueda de texto mira el nombre y también la categoría.
        normalizeText(`${product.name} ${product.category}`).includes(search)
    );
  }, [products, query, category]);

  function clearFilters() {
    setQuery('');
    setCategory('Todas');
  }

  return (
    <>
      <h1>Catálogo</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Buscar por nombre o categoría"
          aria-label="Buscar por nombre o categoría"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="chips" role="group" aria-label="Filtrar por categoría">
          {['Todas', ...categories].map((name) => (
            <button
              key={name}
              type="button"
              className={`chip ${category === name ? 'chip-on' : ''}`}
              aria-pressed={category === name}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <p className="count">{filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}</p>

      {filtered.length > 0 ? (
        <div className="grid">
          {filtered.map((product) => <Card key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="empty-block">
          <p>No encontramos productos con esos filtros.</p>
          <Button variant="secondary" onClick={clearFilters}>Limpiar filtros</Button>
        </div>
      )}
    </>
  );
}
