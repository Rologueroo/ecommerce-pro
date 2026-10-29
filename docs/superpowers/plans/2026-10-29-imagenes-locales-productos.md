# Local Product Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace seed product images with the supplied local JPEGs and safely migrate existing seed products without overwriting user data.

**Architecture:** Keep product records and image rendering unchanged; store local image paths in the existing `image` field. A pure migration helper will map only exact legacy Picsum seed URLs to new seed paths, and the provider will persist that migration through the existing LocalStorage hook.

**Tech Stack:** React 18, Vite 5, JavaScript ES modules, Node.js built-in test runner.

## Global Constraints

- Do not overwrite the stored inventory or reset prices, stock, descriptions, cart, or wishlist.
- Do not change fields other than `image` during migration.
- Maintain support for remote images `http(s)` in products added from the admin panel.
- Do not replace the compiled application from `netlify-dist.zip`; integrate in the Vite project sources and assets.

---

## File Structure

- `public/products/*.jpg` — the 12 supplied local product images.
- `src/data/seedProducts.js` — source of truth for the local image path of each demo product.
- `src/utils/productImages.js` — pure, idempotent migration helper for legacy seed image URLs.
- `src/utils/productImages.test.js` — migration behavior tests using Node's built-in runner.
- `src/context/ShopContext.jsx` — run the migration on the products persisted in LocalStorage.
- `src/utils/validators.js` — accept supported remote URLs and local product image paths.
- `src/utils/validators.test.js` — image value validation tests.
- `src/components/ProductForm.jsx` — tell admins that either a URL or `/products/...jpg` path is accepted.
- `src/data/seedProducts.test.js` — confirm all seed image routes exist in `public/`.

## Task 1: Build the Legacy Image Migration Helper

**Files:**
- Create: `src/utils/productImages.test.js`
- Create: `src/utils/productImages.js`
- Test: `src/utils/productImages.test.js`

**Interfaces:**
- Consumes: `seedProducts` from `src/data/seedProducts.js`, and the existing `[products, setProducts]` pair from `useLocalStorage`.
- Produces: `migrateSeedProductImages(products, seedProducts)`, which returns the same array when no migration is needed and otherwise returns a new array with only matching legacy `image` values changed. Task 2 connects this helper after seed images point at local files.

- [ ] **Step 1: Write failing migration tests**

Create `src/utils/productImages.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { migrateSeedProductImages } from './productImages.js';

const seeds = [{ id: 'P-0001', image: '/products/auriculares.jpg' }];
const legacyImage = 'https://picsum.photos/seed/ecp-auriculares/600/450';

test('migrates only the matching seed product image and preserves its other fields', () => {
  const products = [
    { id: 'P-0001', image: legacyImage, price: 123, stock: 4 },
    { id: 'P-0002', image: 'https://example.com/custom.jpg', price: 456, stock: 7 },
  ];

  assert.deepEqual(migrateSeedProductImages(products, seeds), [
    { id: 'P-0001', image: '/products/auriculares.jpg', price: 123, stock: 4 },
    products[1],
  ]);
});

test('preserves customized and already-local images', () => {
  const customized = { id: 'P-0001', image: 'https://example.com/custom.jpg' };
  const local = { id: 'P-0001', image: '/products/custom.jpg' };

  assert.equal(migrateSeedProductImages([customized], seeds)[0], customized);
  assert.equal(migrateSeedProductImages([local], seeds)[0], local);
});

test('is idempotent and preserves the original array when nothing changes', () => {
  const migrated = migrateSeedProductImages(
    [{ id: 'P-0001', image: legacyImage }],
    seeds
  );
  const secondPass = migrateSeedProductImages(migrated, seeds);
  const unrelated = [{ id: 'P-0002', image: 'https://example.com/custom.jpg' }];

  assert.deepEqual(secondPass, migrated);
  assert.equal(migrateSeedProductImages(unrelated, seeds), unrelated);
});
```

- [ ] **Step 2: Run the tests and verify the missing-helper failure**

Run: `node --test src/utils/productImages.test.js`

Expected: FAIL because `src/utils/productImages.js` does not exist yet.

- [ ] **Step 3: Implement the migration helper**

Create `src/utils/productImages.js`. Match each old seed URL exactly so a custom Picsum URL is not overwritten:

```js
const LEGACY_SEED_IMAGES = {
  'P-0001': 'https://picsum.photos/seed/ecp-auriculares/600/450',
  'P-0002': 'https://picsum.photos/seed/ecp-teclado/600/450',
  'P-0003': 'https://picsum.photos/seed/ecp-reloj/600/450',
  'P-0004': 'https://picsum.photos/seed/ecp-parlante/600/450',
  'P-0005': 'https://picsum.photos/seed/ecp-lampara/600/450',
  'P-0006': 'https://picsum.photos/seed/ecp-cafetera/600/450',
  'P-0007': 'https://picsum.photos/seed/ecp-ollas/600/450',
  'P-0008': 'https://picsum.photos/seed/ecp-manta/600/450',
  'P-0009': 'https://picsum.photos/seed/ecp-zapatillas/600/450',
  'P-0010': 'https://picsum.photos/seed/ecp-mochila/600/450',
  'P-0011': 'https://picsum.photos/seed/ecp-pelota/600/450',
  'P-0012': 'https://picsum.photos/seed/ecp-yoga/600/450',
};

export function migrateSeedProductImages(products, seedProducts) {
  const currentSeedImages = new Map(
    seedProducts.map(({ id, image }) => [id, image])
  );
  let changed = false;

  const migrated = products.map((product) => {
    const newImage = currentSeedImages.get(product.id);
    if (!newImage || product.image !== LEGACY_SEED_IMAGES[product.id]) {
      return product;
    }

    changed = true;
    return { ...product, image: newImage };
  });

  return changed ? migrated : products;
}
```

- [ ] **Step 4: Run the migration tests**

Run: `node --test src/utils/productImages.test.js`

Expected: all 3 tests pass.

- [ ] **Step 5: Commit the migration helper**

```powershell
git add src/utils/productImages.js src/utils/productImages.test.js
git commit -m "feat: add seed image migration helper" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 2: Add Local Images and Update Seed Paths

**Files:**
- Modify: `src/data/seedProducts.js`
- Modify: `src/context/ShopContext.jsx`
- Create: `src/data/seedProducts.test.js`
- Create: `public/products/auriculares.jpg`
- Create: `public/products/teclado.jpg`
- Create: `public/products/smartwatch.jpg`
- Create: `public/products/parlante.jpg`
- Create: `public/products/lampara.jpg`
- Create: `public/products/cafetera.jpg`
- Create: `public/products/ollas.jpg`
- Create: `public/products/manta.jpg`
- Create: `public/products/zapatillas.jpg`
- Create: `public/products/mochila.jpg`
- Create: `public/products/pelota.jpg`
- Create: `public/products/yoga.jpg`
- Test: `src/data/seedProducts.test.js`

**Interfaces:**
- Consumes: local image filenames listed in `cambios-github-imagenes.zip`.
- Consumes: `migrateSeedProductImages(products, seedProducts)` from Task 1.
- Produces: seed `image` values in the form `/products/<filename>.jpg`, available as files under Vite's `public/` directory; the provider migrates persisted legacy seed images through the Task 1 helper.

- [ ] **Step 1: Write the failing seed asset test**

Create `src/data/seedProducts.test.js`:

```js
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { seedProducts } from './seedProducts.js';

test('every seed product references a local image file that exists', () => {
  for (const product of seedProducts) {
    assert.match(product.image, /^\/products\/[A-Za-z0-9_-]+\.jpg$/);
    assert.equal(
      existsSync(new URL(`../../public${product.image}`, import.meta.url)),
      true,
      `Missing image for ${product.id}: ${product.image}`
    );
  }
});
```

- [ ] **Step 2: Run the test and verify it fails before integration**

Run: `node --test src/data/seedProducts.test.js`

Expected: FAIL because current seed values are remote URLs and the local files are absent.

- [ ] **Step 3: Copy the supplied JPEGs without extracting unrelated source files**

Run in PowerShell:

```powershell
$zip = 'C:\Users\Jere\Downloads\cambios-github-imagenes.zip'
$extract = Join-Path $env:TEMP 'ecommerce-pro-product-images'
Expand-Archive -LiteralPath $zip -DestinationPath $extract -Force
New-Item -ItemType Directory -Path 'public\products' -Force | Out-Null
Copy-Item -Path (Join-Path $extract 'public\products\*.jpg') -Destination 'public\products'
```

Expected: the 12 named `.jpg` files exist in `public\products\`.

- [ ] **Step 4: Point seed products at their matching local files**

In `src/data/seedProducts.js`, replace the external `img` helper with:

```js
const photo = (file) => `/products/${file}.jpg`;
```

Use these filenames for each existing product ID; do not change any other product fields:

```js
P-0001: photo('auriculares')
P-0002: photo('teclado')
P-0003: photo('smartwatch')
P-0004: photo('parlante')
P-0005: photo('lampara')
P-0006: photo('cafetera')
P-0007: photo('ollas')
P-0008: photo('manta')
P-0009: photo('zapatillas')
P-0010: photo('mochila')
P-0011: photo('pelota')
P-0012: photo('yoga')
```

- [ ] **Step 5: Connect the migration and verify both behaviors**

In `src/context/ShopContext.jsx`, import `useEffect` and the helper:

```jsx
import { createContext, useContext, useEffect, useMemo } from 'react';
import { migrateSeedProductImages } from '../utils/productImages';
```

Immediately after initializing `products`:

```jsx
useEffect(() => {
  setProducts((current) => migrateSeedProductImages(current, seedProducts));
}, [setProducts]);
```

Run: `node --test src/utils/productImages.test.js src/data/seedProducts.test.js`

Expected: all migration tests pass and every seed product has a matching local image file.

- [ ] **Step 6: Commit the assets and seed data**

```powershell
git add public/products/*.jpg src/data/seedProducts.js src/data/seedProducts.test.js src/context/ShopContext.jsx
git commit -m "feat: migrate seed products to local images" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

## Task 3: Accept Local Image Paths in the Admin Form

**Files:**
- Modify: `src/utils/validators.js`
- Modify: `src/components/ProductForm.jsx`
- Create: `src/utils/validators.test.js`
- Test: `src/utils/validators.test.js`

**Interfaces:**
- Consumes: the existing `isValidUrl(value)` export and product validation contract.
- Produces: `isValidUrl` accepts valid HTTP(S) URLs and a single `/products/<filename>.jpg` path; the admin form explains both accepted formats.

- [ ] **Step 1: Write failing URL validation tests**

Create `src/utils/validators.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { isValidUrl, validateProduct } from './validators.js';

test('accepts remote HTTP(S) image URLs and local product JPEG paths', () => {
  assert.equal(isValidUrl('https://example.com/image.jpg'), true);
  assert.equal(isValidUrl('http://example.com/image.jpg'), true);
  assert.equal(isValidUrl('/products/teclado.jpg'), true);
});

test('rejects empty values, protocol-relative paths, unsupported schemes, and other local paths', () => {
  for (const value of ['', '//example.com/image.jpg', 'javascript:alert(1)', '/admin/image.jpg']) {
    assert.equal(isValidUrl(value), false, `Expected rejection for ${value}`);
  }
});

test('product validation accepts a local product image path', () => {
  assert.deepEqual(
    validateProduct({
      name: 'Teclado mecánico',
      price: '100',
      stock: '2',
      category: 'Tecnología',
      image: '/products/teclado.jpg',
      description: 'Un producto con descripción suficiente.',
    }),
    {}
  );
});
```

- [ ] **Step 2: Run the tests and verify the local-path failure**

Run: `node --test src/utils/validators.test.js`

Expected: the HTTP(S) tests pass and local path tests fail because `isValidUrl` currently requires an absolute URL.

- [ ] **Step 3: Extend image validation**

In `src/utils/validators.js`, add a strict local JPEG path check before parsing a URL:

```js
if (/^\/products\/[A-Za-z0-9_-]+\.jpg$/.test(value)) return true;
```

Keep the existing `URL` parse and HTTP(S)-only protocol check. Update the image validation error so it names both accepted formats.

- [ ] **Step 4: Update the admin form copy and input type**

In `src/components/ProductForm.jsx`, change the image label and input to:

```jsx
<label className="field">
  URL o ruta de la imagen
  <input
    name="image"
    type="text"
    placeholder="https://... o /products/foto.jpg"
    value={form.image}
    onChange={handleChange}
    aria-invalid={Boolean(errors.image)}
  />
  {fieldError('image')}
</label>
```

- [ ] **Step 5: Run tests and production build**

Run: `node --test src/utils/productImages.test.js src/data/seedProducts.test.js src/utils/validators.test.js`

Expected: all tests pass.

Run: `npm run build`

Expected: Vite completes and produces `dist/` without errors.

- [ ] **Step 6: Commit admin image path support**

```powershell
git add src/utils/validators.js src/utils/validators.test.js src/components/ProductForm.jsx
git commit -m "feat: allow local product image paths in admin" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```
