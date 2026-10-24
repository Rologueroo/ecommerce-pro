import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

// Tabla de usuarios registrados: ver y eliminar (los administradores están protegidos).
export default function UsersTable() {
  const { users, deleteUser } = useAuth();
  const [toDelete, setToDelete] = useState(null);

  return (
    <section>
      <div className="section-head">
        <h2>Usuarios ({users.length})</h2>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Deseos</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</td>
                <td>{user.wishlist.length}</td>
                <td className="row-actions">
                  <Button variant="danger" size="sm" disabled={user.role === 'admin'} onClick={() => setToDelete(user)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toDelete && (
        <Modal
          title="Eliminar usuario"
          onClose={() => setToDelete(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setToDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={() => { deleteUser(toDelete.id); setToDelete(null); }}>
                Sí, eliminar
              </Button>
            </>
          }
        >
          <p>¿Querés eliminar a <strong>{toDelete.name}</strong> ({toDelete.email})? También se borra su lista de deseos.</p>
        </Modal>
      )}
    </section>
  );
}
