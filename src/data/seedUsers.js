// Usuario administrador de prueba (cuenta "simulada", según la consigna).
// En un sistema real la contraseña NUNCA se guarda en texto plano ni en el navegador.
export const seedUsers = [
  {
    id: 'U-ADMIN',
    name: 'Administrador',
    email: 'admin@ecommerce.com',
    password: 'Admin123',
    role: 'admin',
    wishlist: [],
  },
];
