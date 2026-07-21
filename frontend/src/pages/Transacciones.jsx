import { useQuery } from "@tanstack/react-query";
import transaccionService from "../services/transaccionService";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import { PageContainer, PageTitle, Card, Badge, EmptyState } from "../styles/ui";
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
        transacciones.map((t) => (
          <Card key={t._id} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <span>
                {t.cliente_id?.nombre} {t.cliente_id?.apellido} → {t.freelancer_id?.nombre}{" "}
                {t.freelancer_id?.apellido}
              </span>
              <Badge $tone={tonoEstado[t.estado]}>{t.estado}</Badge>
            </div>
            <p style={{ margin: "8px 0 0" }}>
              <strong>{t.monto}€</strong> · {t.metodoPago} · {formatearFecha(t.fecha)}
            </p>
          </Card>
        ))
      ) : (
        <EmptyState>No hay transacciones para mostrar.</EmptyState>
      )}
    </PageContainer>
  );
};

export default Transacciones;
