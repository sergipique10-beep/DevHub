import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import portfolioService from "../../services/portfolioService";
import { useAuth } from "../../context/AuthContext";
import PortfolioForm from "./PortfolioForm";
import Loading from "../common/Loading";
import { Card, Grid, Button, Flex, EmptyState, SectionTitle } from "../../styles/ui";

const MiPortfolio = () => {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(null);
  const [creando, setCreando] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ["portfolio", usuario.id],
    queryFn: () => portfolioService.getPorFreelancer(usuario.id),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id) => portfolioService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      toast.success("Eliminado del portfolio");
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <Flex $justify="space-between" style={{ marginBottom: "16px" }}>
        <SectionTitle style={{ margin: 0 }}>Mi portfolio</SectionTitle>
        {!creando && (
          <Button type="button" onClick={() => setCreando(true)}>
            Añadir proyecto
          </Button>
        )}
      </Flex>

      {creando && (
        <Card style={{ marginBottom: "20px" }}>
          <PortfolioForm onSuccess={() => setCreando(false)} onCancel={() => setCreando(false)} />
        </Card>
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
                {item.imagenes?.[0] && (
                  <img
                    src={item.imagenes[0]}
                    alt={item.titulo}
                    style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", marginBottom: "8px" }}
                  />
                )}
                <h3 style={{ margin: "0 0 6px" }}>{item.titulo}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{item.descripcion}</p>
                <Flex $gap={1} style={{ marginTop: "10px" }}>
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
                </Flex>
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
