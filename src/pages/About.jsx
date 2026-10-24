import { team } from '../data/team';
import { handleImageError } from '../utils/format';

export default function About() {
  return (
    <>
      <h1>Nosotros</h1>
      <p className="lead">
        Ecommerce Pro es nuestro proyecto integrador: una tienda con catálogo, cuentas de usuario
        y un panel donde el administrador gestiona el inventario completo.
      </p>

      <h2>El equipo</h2>
      <div className="team">
        {team.map((member) => (
          <figure key={member.name} className="member">
            <img src={member.photo} alt={`Foto de ${member.name}`} loading="lazy" onError={handleImageError} />
            <figcaption>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
