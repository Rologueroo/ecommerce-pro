import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { seedProducts } from '../data/seedProducts';
import { generateId } from '../utils/format';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Inventario y carrito, ambos guardados automáticamente en LocalStorage.
  const [products, setProducts] = useLocalStorage('ecp_products', seedProducts);
  // El carrito guarda solo ids y cantidades: [{ id: 'P-0001', qty: 2 }]
  const [cart, setCart] = useLocalStorage('ecp_cart', []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products]
  );

  // ---------- CRUD de productos (panel de administración) ----------

  function addProduct(data) {
    // El código se genera solo y generateId ya descarta los existentes.
    // Igual lo verificamos antes de guardar: el código único no puede repetirse.
    const id = generateId('P', products.map((product) => product.id));
    if (products.some((product) => product.id === id)) {
      return { ok: false, error: 'El código del producto ya existe. Probá de nuevo.' };
    }
    setProducts((previous) => [...previous, { ...data, id }]);
    return { ok: true };
  }

  function updateProduct(id, data) {
    // El id no se modifica nunca: se conserva el original.
    setProducts((previous) =>
      previous.map((product) => (product.id === id ? { ...data, id } : product))
    );
    return { ok: true };
  }

  function deleteProduct(id) {
    setProducts((previous) => previous.filter((product) => product.id !== id));
  }

  // ---------- Carrito ----------

  function addToCart(productId, quantity = 1) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    setCart((previous) => {
      const existing = previous.find((item) => item.id === productId);
      // Nunca superamos el stock disponible.
      const next = Math.min((existing?.qty ?? 0) + quantity, product.stock);
      if (next <= 0) return previous;
      return existing
        ? previous.map((item) => (item.id === productId ? { ...item, qty: next } : item))
        : [...previous, { id: productId, qty: next }];
    });
  }

  function setCartQty(productId, quantity) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const safeQty = Math.min(quantity, product.stock);
    setCart((previous) =>
      safeQty < 1
        ? previous.filter((item) => item.id !== productId)
        : previous.map((item) => (item.id === productId ? { ...item, qty: safeQty } : item))
    );
  }

  function removeFromCart(productId) {
    setCart((previous) => previous.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  // Une cada item del carrito con su producto REAL. Si el admin borró el producto
  // o bajó su stock, el carrito se ajusta solo (datos derivados, no copiados).
  const cartItems = useMemo(
    () =>
      cart
        .map((item) => ({ product: products.find((p) => p.id === item.id), qty: item.qty }))
        .filter((item) => item.product)
        .map((item) => ({ ...item, qty: Math.min(item.qty, item.product.stock) }))
        .filter((item) => item.qty > 0),
    [cart, products]
  );

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.qty * item.product.price, 0);

  // Compra simulada: descuenta el stock y vacía el carrito.
  // Ambos cambios se guardan solos gracias al useEffect de useLocalStorage.
  function checkout() {
    setProducts((previous) =>
      previous.map((product) => {
        const bought = cartItems.find((item) => item.product.id === product.id);
        return bought ? { ...product, stock: product.stock - bought.qty } : product;
      })
    );
    setCart([]);
  }

  const value = {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    setCartQty,
    removeFromCart,
    clearCart,
    checkout,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop debe usarse dentro de <ShopProvider>');
  return context;
}
