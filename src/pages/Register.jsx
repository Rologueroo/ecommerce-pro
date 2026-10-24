import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { validateRegister } from '../utils/validators';

export default function Register() {
  const { users, isLoggedIn, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  if (isLoggedIn) return <Navigate to="/" replace />;

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  function handleSubmit(event) {
    event.preventDefault();
    const foundErrors = validateRegister(form, users);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;
    register(form); // crea el usuario e inicia la sesión
    navigate('/');
  }

  const fieldError = (name) => errors[name] && <span className="error" role="alert">{errors[name]}</span>;

  return (
    <section className="auth">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="form" noValidate>
        <label className="field">
          Nombre
          <input name="name" value={form.name} onChange={handleChange} autoComplete="name" aria-invalid={Boolean(errors.name)} />
          {fieldError('name')}
        </label>
        <label className="field">
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" aria-invalid={Boolean(errors.email)} />
          {fieldError('email')}
        </label>
        <label className="field">
          Contraseña
          <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" aria-invalid={Boolean(errors.password)} />
          {fieldError('password')}
        </label>
        <label className="field">
          Repetir contraseña
          <input name="confirm" type="password" value={form.confirm} onChange={handleChange} autoComplete="new-password" aria-invalid={Boolean(errors.confirm)} />
          {fieldError('confirm')}
        </label>
        <Button type="submit">Crear cuenta</Button>
      </form>
      <p className="muted">¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
    </section>
  );
}
