import { useQuery } from "@tanstack/react-query";
import transaccionService from "../services/transaccionService";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import styled from "styled-components";
import { PageContainer, PageTitle, Card, Badge, EmptyState, Stack, Flex } from "../styles/ui";

const Detalle = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1)};
`;
import { formatearFecha } from "../utils/parse";

const tonoEstado = {
  Pendiente: "warning",
  Completada: "success",
  Reembolsada: "danger",
};

const Transacciones = () => {
  const { usuario } = useAuth();
  const esAdmin = usuario.role === "Admin";

  const { data: transacciones, isLoading } = useQuery({
    queryKey: esAdmin ? ["transacciones", "todas"] : ["transacciones", usuario.id],
    queryFn: () =>
      esAdmin ? transaccionService.getAll() : transaccionService.getPorUsuario(usuario.id),
  });

  return (
    <PageContainer>
      <PageTitle>Transacciones</PageTitle>
      {isLoading ? (
        <Loading />
      ) : transacciones?.length ? (
        <Stack $gap={1.5}>
          {transacciones.map((t) => (
            <Card key={t._id}>
              <Flex $justify="space-between" $wrap>
                <span>
                  {t.cliente_id?.nombre} {t.cliente_id?.apellido} → {t.freelancer_id?.nombre}{" "}
                  {t.freelancer_id?.apellido}
                </span>
                <Badge $tone={tonoEstado[t.estado]}>{t.estado}</Badge>
              </Flex>
              <Detalle>
                <strong>{t.monto}€</strong> · {t.metodoPago} · {formatearFecha(t.fecha)}
              </Detalle>
            </Card>
          ))}
        </Stack>
      ) : (
        <EmptyState>No hay transacciones para mostrar.</EmptyState>
      )}
    </PageContainer>
  );
};

export default Transacciones;
