# Imágenes locales para productos

## Objetivo

Integrar las imágenes de productos incluidas en `cambios-github-imagenes.zip` en la tienda existente, sin reemplazar el inventario ni las personalizaciones ya guardadas en el navegador.

## Diseño

- Incorporar las 12 imágenes `.jpg` en `public/products/`.
- Cambiar `src/data/seedProducts.js` para que cada producto inicial use una ruta local `/products/<archivo>.jpg`. Para el producto Smartwatch Orbit, el archivo correcto es `smartwatch.jpg`.
- Ajustar `isValidUrl` y `validateProduct` en `src/utils/validators.js` para aceptar URLs `http(s)` existentes y rutas locales dentro de `/products/`, rechazando rutas protocol-relative como `//host/path`.
- Ajustar `src/components/ProductForm.jsx` para que el campo de imagen acepte una URL o una ruta como `/products/teclado.jpg`.
- Migrar los productos existentes de `ecp_products` de forma idempotente: emparejar por ID con los productos semilla y cambiar únicamente `image` cuando su valor todavía corresponde al formato antiguo de Picsum (`https://picsum.photos/seed/ecp-...`). Conservar los demás campos, los productos adicionales y cualquier imagen personalizada o ya local.

## Límites

- No sobrescribir el inventario almacenado ni reiniciar precios, stock, descripciones, carrito o lista de deseos.
- No cambiar los campos distintos de `image` durante la migración.
- Mantener el soporte para imágenes remotas `http(s)` en productos agregados desde el panel.
- No reemplazar la aplicación compilada de `netlify-dist.zip`; la integración se hace en las fuentes y assets del proyecto Vite.

## Validación

1. Ejecutar `npm run build`.
2. Comprobar que cada ruta de imagen de los productos semilla corresponde a un archivo existente en `public/products/`.
3. Comprobar que `isValidUrl` admite URLs HTTP(S) y rutas `/products/...`, y rechaza valores vacíos, protocolos no HTTP(S) y rutas `//...`.
4. Verificar que la migración solo cambia las imágenes Picsum de los productos semilla y preserva los otros datos, productos adicionales e imágenes personalizadas.
