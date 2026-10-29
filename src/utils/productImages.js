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
