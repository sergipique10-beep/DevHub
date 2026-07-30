import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import portfolioService from "../../services/portfolioService";
import { useAuth } from "../../context/AuthContext";
import useMutacion from "../../hooks/useMutacion";
import PortfolioForm from "./PortfolioForm";
import Loading from "../common/Loading";
import {
  Card,
  Grid,
  Button,
  Flex,
  EmptyState,
  SectionTitle,
  CardTitle,
  MutedText,
  Thumb,
} from "../../styles/ui";

const Cabecera = styled(Flex)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Titulo = styled(SectionTitle)`
  margin-bottom: 0;
`;

const Formulario = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
`;

const Portada = styled(Thumb)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const Acciones = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing(1.25)};
`;

const MiPortfolio = () => {
  const { usuario } = useAuth();
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ["portfolio", usuario.id],
    queryFn: () => portfolioService.getPorFreelancer(usuario.id),
  });

  const eliminarMutation = useMutacion({
    mutationFn: (id) => portfolioService.remove(id),
    exito: "Eliminado del portfolio",
    invalidar: [["portfolio"]],
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <Cabecera $justify="space-between">
        <Titulo>Mi portfolio</Titulo>
        {!creando && (
          <Button type="button" onClick={() => setCreando(true)}>
            Añadir proyecto
          </Button>
        )}
      </Cabecera>

      {creando && (
        <Formulario>
          <PortfolioForm onSuccess={() => setCreando(false)} onCancel={() => setCreando(false)} />
        </Formulario>
      )}

      {items?.length ? (
        <Grid>
          {items.map((item) =>
            editando === item._id ? (
              <Card key={item._id}>
                <PortfolioForm
                  item={item}
                  onSuccess={() => setEditando(null)}
                  onCancel={() => setEditando(null)}
                />
              </Card>
            ) : (
              <Card key={item._id}>
                {item.imagenes?.[0] && <Portada src={item.imagenes[0]} alt={item.titulo} />}
                <CardTitle>{item.titulo}</CardTitle>
                <MutedText $size="0.9rem">{item.descripcion}</MutedText>
                <Acciones $gap={1}>
                  <Button type="button" $variant="secondary" onClick={() => setEditando(item._id)}>
                    Editar
                  </Button>
                  <Button
                    type="button"
                    $variant="danger"
                    onClick={() => eliminarMutation.mutate(item._id)}
                  >
                    Eliminar
                  </Button>
                </Acciones>
              </Card>
            )
          )}
        </Grid>
      ) : (
        <EmptyState>Todavía no has añadido proyectos a tu portfolio.</EmptyState>
      )}
    </div>
  );
};

export default MiPortfolio;
