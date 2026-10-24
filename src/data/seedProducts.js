// Productos de ejemplo. Se cargan SOLO la primera vez, cuando LocalStorage está vacío.
// Las imágenes son URLs externas (picsum.photos); el admin puede reemplazarlas por las reales.
const img = (seed) => `https://picsum.photos/seed/ecp-${seed}/600/450`;

export const seedProducts = [
  { id: 'P-0001', name: 'Auriculares Bluetooth Pulse', price: 48900, stock: 15, category: 'Tecnología', image: img('auriculares'), description: 'Auriculares inalámbricos con cancelación de ruido y hasta 30 horas de batería.' },
  { id: 'P-0002', name: 'Teclado mecánico Forge', price: 72500, stock: 8, category: 'Tecnología', image: img('teclado'), description: 'Teclado mecánico con switches rojos, retroiluminación y cable desmontable.' },
  { id: 'P-0003', name: 'Smartwatch Orbit', price: 129900, stock: 5, category: 'Tecnología', image: img('reloj'), description: 'Reloj inteligente con GPS, monitor de actividad y resistencia al agua.' },
  { id: 'P-0004', name: 'Parlante portátil Eco', price: 39900, stock: 20, category: 'Tecnología', image: img('parlante'), description: 'Parlante Bluetooth resistente a salpicaduras con 12 horas de reproducción.' },
  { id: 'P-0005', name: 'Lámpara de escritorio LED', price: 21500, stock: 12, category: 'Hogar', image: img('lampara'), description: 'Lámpara LED con brazo flexible, tres niveles de luz y carga USB integrada.' },
  { id: 'P-0006', name: 'Cafetera de filtro Aroma', price: 45900, stock: 9, category: 'Hogar', image: img('cafetera'), description: 'Cafetera eléctrica de 1,5 litros con jarra de vidrio y apagado automático.' },
  { id: 'P-0007', name: 'Set de ollas antiadherentes', price: 84900, stock: 6, category: 'Hogar', image: img('ollas'), description: 'Juego de cinco ollas con revestimiento antiadherente, aptas para todo tipo de cocina.' },
  { id: 'P-0008', name: 'Manta polar doble', price: 18900, stock: 25, category: 'Hogar', image: img('manta'), description: 'Manta polar de dos plazas, suave y liviana, ideal para los días de frío.' },
  { id: 'P-0009', name: 'Zapatillas Runner Air', price: 96500, stock: 10, category: 'Deportes', image: img('zapatillas'), description: 'Zapatillas de running con suela amortiguada y capellada de malla respirable.' },
  { id: 'P-0010', name: 'Mochila Trek 30L', price: 52900, stock: 14, category: 'Deportes', image: img('mochila'), description: 'Mochila de 30 litros con espalda ventilada, cubre lluvia y bolsillo para hidratación.' },
  { id: 'P-0011', name: 'Pelota de fútbol Match', price: 17500, stock: 30, category: 'Deportes', image: img('pelota'), description: 'Pelota de fútbol número 5 con costura reforzada, para cancha y entrenamiento.' },
  { id: 'P-0012', name: 'Mat de yoga Flow', price: 14900, stock: 0, category: 'Deportes', image: img('yoga'), description: 'Mat antideslizante de 6 mm de espesor, con correa para transportarlo.' },
];
