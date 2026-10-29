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
