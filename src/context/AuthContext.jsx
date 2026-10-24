import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { seedUsers } from '../data/seedUsers';
import { generateId } from '../utils/format';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lista de usuarios y sesión, ambas guardadas en LocalStorage.
  const [users, setUsers] = useLocalStorage('ecp_users', seedUsers);
  // La sesión guarda SOLO el id del usuario (o null si es invitado).
  const [sessionId, setSessionId] = useLocalStorage('ecp_session', null);

  // El usuario actual se calcula desde la lista: así hay una sola fuente de verdad.
  // Si el admin borra a este usuario, deja de ser encontrado y vuelve a ser invitado.
  const currentUser = users.find((user) => user.id === sessionId) ?? null;
  const isLoggedIn = currentUser !== null;
  const isAdmin = currentUser?.role === 'admin';
  const roleLabel = isAdmin ? 'Administrador' : isLoggedIn ? 'Usuario' : 'Invitado';

  function register({ name, email, password }) {
    const newUser = {
      id: generateId('U', users.map((user) => user.id)),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'user',
      wishlist: [],
    };
    setUsers((previous) => [...previous, newUser]);
    setSessionId(newUser.id); // al registrarse, la sesión queda iniciada
  }

  function login(email, password) {
    const user = users.find(
      (item) => item.email === email.trim().toLowerCase() && item.password === password
    );
    if (!user) return { ok: false, error: 'Email o contraseña incorrectos.' };
    setSessionId(user.id);
    return { ok: true, user };
  }

  function logout() {
    setSessionId(null);
  }

  // El admin no puede borrarse a sí mismo ni a otros administradores.
  function deleteUser(id) {
    setUsers((previous) =>
      previous.filter((user) => user.id !== id || user.role === 'admin')
    );
  }

  // Agrega o quita un producto de la lista de deseos del usuario logueado.
  // La lista vive DENTRO del usuario, así se elimina junto con él.
  function toggleWishlist(productId) {
    if (!currentUser) return;
    setUsers((previous) =>
      previous.map((user) => {
        if (user.id !== currentUser.id) return user;
        const inList = user.wishlist.includes(productId);
        return {
          ...user,
          wishlist: inList
            ? user.wishlist.filter((id) => id !== productId)
            : [...user.wishlist, productId],
        };
      })
    );
  }

  const value = {
    users,
    currentUser,
    isLoggedIn,
    isAdmin,
    roleLabel,
    register,
    login,
    logout,
    deleteUser,
    toggleWishlist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para usar el contexto con una sola línea: const { isAdmin } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
