import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import usuarioService from "../../services/usuarioService";
import Avatar from "../common/Avatar";
import RatingStars from "../common/RatingStars";
import Loading from "../common/Loading";
import { Card, Grid, Form, FormGroup, Label, Input, Select, Button, EmptyState, Flex } from "../../styles/ui";
import { listaDesde } from "../../utils/parse";

const BuscarFreelancers = () => {
  const [skillsInput, setSkillsInput] = useState("");
  const [minRating, setMinRating] = useState("");
  const [filtros, setFiltros] = useState({});

  const { data: resultados, isLoading } = useQuery({
    queryKey: ["usuarios", "buscar", filtros],
    queryFn: () => usuarioService.buscar(filtros),
  });

  const freelancers = (resultados || []).filter((u) => u.role === "Freelancer");

  const buscar = (e) => {
    e.preventDefault();
    setFiltros({ skills: listaDesde(skillsInput, ","), minRating: minRating || undefined });
  };

  return (
    <div>
      <Card style={{ marginBottom: "20px" }}>
        <Form onSubmit={buscar} style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end" }}>
          <FormGroup style={{ flex: 1, minWidth: "200px" }}>
            <Label htmlFor="skills">Skills (separados por coma)</Label>
            <Input
              id="skills"
              placeholder="react, node, mongodb"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
            />
          </FormGroup>
          <FormGroup style={{ minWidth: "160px" }}>
            <Label htmlFor="minRating">Rating mínimo</Label>
            <Select id="minRating" value={minRating} onChange={(e) => setMinRating(e.target.value)}>
              <option value="">Cualquiera</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </Select>
          </FormGroup>
          <Button type="submit">Buscar</Button>
        </Form>
      </Card>

      {isLoading ? (
        <Loading />
      ) : freelancers?.length ? (
        <Grid>
          {freelancers.map((f) => (
            <Card key={f._id} as={Link} to={`/perfil/${f._id}`} style={{ display: "block" }}>
              <Flex $gap={1.5}>
                <Avatar nombre={f.nombre} fotoPerfil={f.fotoPerfil} />
                <div>
                  <strong>
                    {f.nombre} {f.apellido}
                  </strong>
                  <p style={{ margin: "2px 0", color: "#94a3b8", fontSize: "0.85rem" }}>
                    {f.ubicacion}
                  </p>
                  <RatingStars promedio={f.rating?.promedio} cantidad={f.rating?.cantidad} />
                </div>
              </Flex>
              <Flex $wrap $gap={0.5} style={{ marginTop: "10px" }}>
                {(f.skills || []).slice(0, 4).map((s) => (
                  <span
                    key={s.nombre}
                    style={{
                      background: "rgba(56, 189, 248, 0.14)",
                      color: "#38bdf8",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {s.nombre}
                  </span>
                ))}
              </Flex>
            </Card>
          ))}
        </Grid>
      ) : (
        <EmptyState>No se encontraron freelancers con esos filtros.</EmptyState>
      )}
    </div>
  );
};

export default BuscarFreelancers;
