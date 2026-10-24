// TODO del equipo: reemplazar nombres, roles y fotos por los reales.
// Las fotos pueden ser URLs externas o imágenes dentro de /public (por ejemplo "/team/ana.jpg").
const photo = (seed) => `https://picsum.photos/seed/team-${seed}/400/400`;

export const team = [
  { name: 'Integrante 1', role: 'Scrum Master y frontend', photo: photo(1) },
  { name: 'Integrante 2', role: 'Panel de administración', photo: photo(2) },
  { name: 'Integrante 3', role: 'Catálogo y detalle', photo: photo(3) },
  { name: 'Integrante 4', role: 'Diseño y estilos', photo: photo(4) },
];
