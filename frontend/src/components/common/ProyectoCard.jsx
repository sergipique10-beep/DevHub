import { Link } from "react-router-dom";
import styled from "styled-components";
import { Card, Badge, CardTitle, MutedText } from "../../styles/ui";
import { TONO_ESTADO } from "../../constants/proyecto";
import { formatearFecha } from "../../utils/parse";

const Ficha = styled(Card)`
  display: block;
`;

const Meta = styled(MutedText)`
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

/**
 * Tarjeta de resumen de un proyecto. La usan la lista del cliente, la del
 * freelancer y el perfil público, que antes repetían el mismo marcado.
 */
const ProyectoCard = ({ proyecto, mostrarPropuestas = false }) => (
  <Ficha as={Link} to={`/proyectos/${proyecto._id}`}>
    <CardTitle>{proyecto.titulo}</CardTitle>
    <Badge $tone={TONO_ESTADO[proyecto.estado]}>{proyecto.estado}</Badge>
    <Meta>
      Presupuesto: {proyecto.presupuesto}€ · Entrega: {formatearFecha(proyecto.deadline)}
    </Meta>
    {mostrarPropuestas && (
      <MutedText>{proyecto.propuestas?.length || 0} propuesta(s) recibida(s)</MutedText>
    )}
  </Ficha>
);

export default ProyectoCard;
