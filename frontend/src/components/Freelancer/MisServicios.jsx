import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import servicioService from "../../services/servicioService";
import { useAuth } from "../../context/AuthContext";
import ServicioForm from "./ServicioForm";
import Loading from "../common/Loading";
import { Card, Grid, Button, Flex, EmptyState } from "../../styles/ui";

const MisServicios = () => {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState(null);

  const { data: servicios, isLoading } = useQuery({
    queryKey: ["servicios", { freelancer_id: usuario.id }],
    queryFn: () => servicioService.getAll({ freelancer_id: usuario.id }),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id) => servicioService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios"] });
      toast.success("Servicio eliminado");
    },
    onError: (error) => toast.error(error.message),
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
                <h3 style={{ margin: "0 0 6px" }}>{s.titulo}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{s.categoria}</p>
                <p style={{ fontWeight: 700 }}>{s.precioBase}€ · {s.tiempoEntrega} días</p>
                <Flex $gap={1} style={{ marginTop: "10px" }}>
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
                </Flex>
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
