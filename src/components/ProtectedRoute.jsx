import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Envuelve una página y decide si el usuario puede verla.
//   <ProtectedRoute adminOnly> ... </ProtectedRoute>
export default function ProtectedRoute({ adminOnly = false, children }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  // Sin sesión: va al login y recordamos a dónde quería entrar.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  // Con sesión pero sin permisos de administrador: mostramos la página 404.
  if (adminOnly && !isAdmin) {
    return <Navigate to="/404" replace />;
  }
  return children;
}
