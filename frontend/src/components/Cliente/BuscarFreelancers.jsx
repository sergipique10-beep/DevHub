import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import usuarioService from "../../services/usuarioService";
import useDebounce from "../../hooks/useDebounce";
import Avatar from "../common/Avatar";
import RatingStars from "../common/RatingStars";
import Loading from "../common/Loading";
import {
  Card,
  Grid,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  Badge,
  EmptyState,
  Flex,
  MutedText,
} from "../../styles/ui";
import { listaDesde } from "../../utils/parse";

const Filtros = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
`;

const FilaFiltros = styled(Form)`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const CampoAncho = styled(FormGroup)`
  flex: 1;
  min-width: 200px;
`;

const CampoEstrecho = styled(FormGroup)`
  min-width: 160px;
`;

const Ficha = styled(Card)`
  display: block;
`;

const Skills = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing(1.25)};
`;

const BuscarFreelancers = () => {
  const [skillsInput, setSkillsInput] = useState("");
  const [minRating, setMinRating] = useState("");

  // Sin debounce cada tecla dispararia una peticion; con el, la busqueda es
  // en vivo y no hace falta un boton "Buscar".
  const skillsDebounced = useDebounce(skillsInput);

  const filtros = useMemo(
    () => ({
      skills: listaDesde(skillsDebounced, ","),
      minRating: minRating || undefined,
    }),
    [skillsDebounced, minRating]
  );

  const { data: resultados, isLoading } = useQuery({
    queryKey: ["usuarios", "buscar", filtros],
    queryFn: () => usuarioService.buscar(filtros),
  });

  const freelancers = useMemo(
    () => (resultados || []).filter((u) => u.role === "Freelancer"),
    [resultados]
  );

  return (
    <div>
      <Filtros>
        <FilaFiltros onSubmit={(e) => e.preventDefault()}>
          <CampoAncho>
            <Label htmlFor="skills">Skills (separados por coma)</Label>
            <Input
              id="skills"
              placeholder="react, node, mongodb"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
            />
          </CampoAncho>
          <CampoEstrecho>
            <Label htmlFor="minRating">Rating mínimo</Label>
            <Select id="minRating" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="">Cualquiera</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </Select>
          </CampoEstrecho>
        </FilaFiltros>
      </Filtros>

      {isLoading ? (
        <Loading />
      ) : freelancers.length ? (
        <Grid>
          {freelancers.map((f) => (
            <Ficha key={f._id} as={Link} to={`/perfil/${f._id}`}>
              <Flex $gap={1.5}>
                <Avatar nombre={f.nombre} fotoPerfil={f.fotoPerfil} />
                <div>
                  <strong>
                    {f.nombre} {f.apellido}
                  </strong>
                  <MutedText>{f.ubicacion}</MutedText>
                  <RatingStars promedio={f.rating?.promedio} cantidad={f.rating?.cantidad} />
                </div>
              </Flex>
              <Skills $wrap $gap={0.5}>
                {(f.skills || []).slice(0, 4).map((s) => (
                  <Badge key={s.nombre}>{s.nombre}</Badge>
                ))}
              </Skills>
            </Ficha>
          ))}
        </Grid>
      ) : (
        <EmptyState>No se encontraron freelancers con esos filtros.</EmptyState>
      )}
    </div>
  );
};

export default BuscarFreelancers;
