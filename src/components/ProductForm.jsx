import { useState } from 'react';
import Button from './Button';
import { useShop } from '../context/ShopContext';
import { validateProduct } from '../utils/validators';

const EMPTY = { name: '', price: '', stock: '', category: '', image: '', description: '' };

// Formulario para agregar o editar. Si recibe `product`, está en modo edición.
export default function ProductForm({ product = null, onSaved, onCancel }) {
  const { categories, addProduct, updateProduct } = useShop();
  const [form, setForm] = useState(
    product ? { ...product, price: String(product.price), stock: String(product.stock) } : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  function handleSubmit(event) {
    event.preventDefault();
    const foundErrors = validateProduct(form);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return; // hay errores: no se guarda

    // Convertimos los textos a los tipos correctos antes de guardar.
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category.trim(),
      image: form.image.trim(),
      description: form.description.trim(),
    };

    const result = product ? updateProduct(product.id, data) : addProduct(data);
    if (!result.ok) return setSubmitError(result.error);
    onSaved();
  }

  // Pequeño helper para no repetir el mensaje de error en cada campo.
  const fieldError = (name) => errors[name] && <span className="error" role="alert">{errors[name]}</span>;

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      <label className="field">
        Código
        <input value={product ? product.id : 'Se genera automáticamente'} disabled />
      </label>

      <label className="field">
        Nombre
        <input name="name" value={form.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} />
        {fieldError('name')}
      </label>

      <div className="field-row">
        <label className="field">
          Precio (ARS)
          <input name="price" type="number" min="0" step="any" value={form.price} onChange={handleChange} aria-invalid={Boolean(errors.price)} />
          {fieldError('price')}
        </label>
        <label className="field">
          Stock
          <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} aria-invalid={Boolean(errors.stock)} />
          {fieldError('stock')}
        </label>
      </div>

      <label className="field">
        Categoría
        {/* datalist: sugiere las categorías existentes, pero permite crear una nueva */}
        <input name="category" list="category-options" value={form.category} onChange={handleChange} aria-invalid={Boolean(errors.category)} />
        <datalist id="category-options">
          {categories.map((category) => <option key={category} value={category} />)}
        </datalist>
        {fieldError('category')}
      </label>

      <label className="field">
        URL de la imagen
        <input name="image" type="url" placeholder="https://..." value={form.image} onChange={handleChange} aria-invalid={Boolean(errors.image)} />
        {fieldError('image')}
      </label>

      <label className="field">
        Descripción
        <textarea name="description" rows="3" value={form.description} onChange={handleChange} aria-invalid={Boolean(errors.description)} />
        {fieldError('description')}
      </label>

      {submitError && <p className="error" role="alert">{submitError}</p>}

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{product ? 'Guardar cambios' : 'Agregar producto'}</Button>
      </div>
    </form>
  );
}
