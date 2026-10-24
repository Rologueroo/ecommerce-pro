# Ecommerce Pro

Proyecto integrador: tienda online hecha con **React + React Router DOM + LocalStorage**.
Los visitantes navegan un catálogo, ven el detalle de cada producto, se registran y arman una lista de deseos.
El administrador gestiona el inventario y los usuarios desde un panel protegido.

> Todo se guarda en el navegador (LocalStorage): no hay servidor ni base de datos.

## Demo

- Sitio publicado: _(pegar acá la URL de Netlify o Vercel)_
- Tablero Trello: https://trello.com/b/81LhqnH0/ecommerce-pro
- Repositorio: https://github.com/Rologueroo/ecommerce-pro

**Cuenta de administrador de prueba:** `admin@ecommerce.com` · `Admin123`

## Funcionalidades

| Perfil | Qué puede hacer |
| --- | --- |
| Invitado | Ver el catálogo, filtrar por nombre o categoría en tiempo real, ver el detalle, usar el carrito, registrarse e iniciar sesión |
| Usuario registrado | Todo lo anterior, más una lista de deseos personal y compra simulada |
| Administrador | Panel CRUD de productos (agregar, editar, borrar con validaciones y código único) y gestión de usuarios (ver y eliminar) |

La sesión persiste al recargar y la barra superior indica si quien navega es **Invitado**, **Usuario** o **Administrador**.

## Rutas

| Ruta | Página | Acceso |
| --- | --- | --- |
| `/` | Catálogo principal | Público |
| `/product/:id` | Detalle del producto | Público |
| `/about` | Nosotros, con galería del equipo | Público |
| `/login`, `/register` | Ingreso y registro | Público |
| `/wishlist` | Lista de deseos | Usuario logueado |
| `/admin` | Panel de administración | Solo administrador |
| `/404` | Error personalizado (también para rutas inexistentes) | Público |

## Cómo correrlo

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # genera la carpeta dist/
npm run preview   # prueba la versión compilada
```

## Estructura

```
src/
├── main.jsx               # punto de entrada: Router + proveedores de estado
├── App.jsx                # tabla de rutas
├── index.css              # estilos (variables, componentes, responsive)
├── hooks/useLocalStorage.js   # useState + useEffect: guarda todo automáticamente
├── context/
│   ├── AuthContext.jsx    # usuarios, sesión y lista de deseos
│   └── ShopContext.jsx    # productos (CRUD) y carrito
├── components/            # Button, Card, Modal, Navbar, formularios, tablas
├── pages/                 # una página por ruta
├── utils/                 # validadores y formato
└── data/                  # productos, usuario admin y equipo de ejemplo
```

## Modelo de datos (LocalStorage)

| Clave | Contenido |
| --- | --- |
| `ecp_products` | `{ id, name, price, stock, category, image, description }` |
| `ecp_users` | `{ id, name, email, password, role, wishlist: [productId] }` |
| `ecp_session` | id del usuario con sesión iniciada, o `null` |
| `ecp_cart` | `[{ id, qty }]` |

Para volver al estado inicial: DevTools → Application → Local Storage → borrar las claves `ecp_*`.

## Decisiones técnicas

- **Un solo hook de persistencia** (`useLocalStorage`): usa `useEffect` para guardar cada cambio.
- **Una única fuente de verdad**: la sesión guarda solo un id; carrito y lista de deseos guardan ids y se resuelven contra los productos reales.
- **Rutas protegidas** con un componente `ProtectedRoute` que revisa la sesión y el rol.
- **Código único**: el id de cada producto se genera automáticamente y se verifica antes de guardar.
- **Validaciones** centralizadas en `utils/validators.js`.

## Limitaciones conocidas

- Las contraseñas se guardan en texto plano porque el login es simulado (según la consigna). Un sistema real usaría un servidor y contraseñas con hash.
- Los datos viven solo en el navegador de cada persona.

## Despliegue

- **Vercel**: importar el repositorio; ya incluye `vercel.json` para que las rutas funcionen al recargar.
- **Netlify**: build command `npm run build`, publish directory `dist`; ya incluye `public/_redirects`.

## Equipo

| Integrante | Rol |
| --- | --- |
| Juan Salmeron | Scrum Master: organiza el tablero, planifica los sprints, modera las dailies y coordina documentación y pruebas |
| Jeremías Ocaranza | Tech Leader: define la arquitectura, desarrolla la app, hace el code review y el deploy |

El desglose de tareas por sprint está en el [tablero de Trello](https://trello.com/b/81LhqnH0/ecommerce-pro).
