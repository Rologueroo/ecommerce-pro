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
