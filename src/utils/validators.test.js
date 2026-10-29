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
