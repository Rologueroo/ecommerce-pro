import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Si ya hay sesión iniciada no tiene sentido mostrar el login.
  if (isLoggedIn) return <Navigate to="/" replace />;

  function handleSubmit(event) {
    event.preventDefault();
    const result = login(form.email, form.password);
    if (!result.ok) return setError(result.error);
    // Volvemos a la página que el usuario quería visitar (o al inicio).
    navigate(location.state?.from ?? '/', { replace: true });
  }

  return (
    <section className="auth">
      <h1>Ingresar</h1>
      <form onSubmit={handleSubmit} className="form" noValidate>
        <label className="field">
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
        </label>
        <label className="field">
          Contraseña
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <Button type="submit">Ingresar</Button>
      </form>
      <p className="muted">¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
      <p className="demo-box">
        <strong>Cuenta de administrador para la demo:</strong><br />
        admin@ecommerce.com · Admin123
      </p>
    </section>
  );
}
