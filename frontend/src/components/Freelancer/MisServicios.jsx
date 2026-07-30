import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import servicioService from "../../services/servicioService";
import { useAuth } from "../../context/AuthContext";
import useMutacion from "../../hooks/useMutacion";
import ServicioForm from "./ServicioForm";
import Loading from "../common/Loading";
import { Card, Grid, Button, Flex, EmptyState, CardTitle, MutedText } from "../../styles/ui";

const Precio = styled.p`
  font-weight: 700;
`;

const Acciones = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing(1.25)};
`;

const MisServicios = () => {
  const { usuario } = useAuth();
  const [editando, setEditando] = useState(null);

  const { data: servicios, isLoading } = useQuery({
    queryKey: ["servicios", { freelancer_id: usuario.id }],
    queryFn: () => servicioService.getAll({ freelancer_id: usuario.id }),
  });

  const eliminarMutation = useMutacion({
    mutationFn: (id) => servicioService.remove(id),
    exito: "Servicio eliminado",
    invalidar: [["servicios"]],
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      {servicios?.length ? (
        <Grid>
          {servicios.map((s) =>
            editando === s._id ? (
              <Card key={s._id}>
                <ServicioForm
                  servicio={s}
                  onSuccess={() => setEditando(null)}
                  onCancel={() => setEditando(null)}
                />
              </Card>
            ) : (
              <Card key={s._id}>
                <CardTitle>{s.titulo}</CardTitle>
                <MutedText $size="0.9rem">{s.categoria}</MutedText>
                <Precio>
                  {s.precioBase}€ · {s.tiempoEntrega} días
                </Precio>
                <Acciones $gap={1}>
                  <Button type="button" $variant="secondary" onClick={() => setEditando(s._id)}>
                    Editar
                  </Button>
                  <Button
                    type="button"
                    $variant="danger"
                    onClick={() => eliminarMutation.mutate(s._id)}
                  >
                    Eliminar
                  </Button>
                </Acciones>
              </Card>
            )
          )}
        </Grid>
      ) : (
        <EmptyState>Todavía no has publicado ningún servicio.</EmptyState>
      )}
    </div>
  );
};

export default MisServicios;
