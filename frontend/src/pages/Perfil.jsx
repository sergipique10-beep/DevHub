import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import usuarioService from "../services/usuarioService";
import PerfilFreelancer from "../components/Perfil/PerfilFreelancer";
import PerfilCliente from "../components/Perfil/PerfilCliente";
import Loading from "../components/common/Loading";
import { PageContainer, EmptyState } from "../styles/ui";

const Perfil = () => {
  const { id } = useParams();
  const { data: usuario, isLoading, isError } = useQuery({
    queryKey: ["usuario", id],
    queryFn: () => usuarioService.getById(id),
  });

  return (
    <PageContainer>
      {isLoading ? (
        <Loading />
      ) : isError || !usuario ? (
        <EmptyState>No se encontró este perfil.</EmptyState>
      ) : usuario.role === "Freelancer" ? (
        <PerfilFreelancer usuario={usuario} />
      ) : (
        <PerfilCliente usuario={usuario} />
      )}
    </PageContainer>
  );
};

export default Perfil;
