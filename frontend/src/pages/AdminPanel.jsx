import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import usuarioService from "../services/usuarioService";
import postService from "../services/postService";
import useMutacion from "../hooks/useMutacion";
import Loading from "../components/common/Loading";
import Avatar from "../components/common/Avatar";
import {
  PageContainer,
  PageTitle,
  SectionTitle,
  Card,
  Badge,
  Button,
  Flex,
  Stack,
  EmptyState,
  MutedText,
  StatNumber,
} from "../styles/ui";

const Resumen = styled(Flex)`
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
`;

const SubSeccion = styled(SectionTitle)`
  margin-top: ${({ theme }) => theme.spacing(3.5)};
`;

const AdminPanel = () => {
  const { data: usuarios, isLoading: cargandoUsuarios } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => usuarioService.getAll(),
  });

  const { data: posts, isLoading: cargandoPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getAll(),
  });

  const verificarMutation = useMutacion({
    mutationFn: ({ id, verificado }) => usuarioService.update(id, { verificado }),
    exito: "Estado de verificación actualizado",
    invalidar: [["usuarios"]],
  });

  const desactivarMutation = useMutacion({
    mutationFn: (id) => usuarioService.remove(id),
    exito: "Usuario desactivado",
    invalidar: [["usuarios"]],
  });

  const borrarPostMutation = useMutacion({
    mutationFn: (id) => postService.remove(id),
    exito: "Post eliminado",
    invalidar: [["posts"]],
  });

  return (
    <PageContainer>
      <PageTitle>Panel de administración</PageTitle>

      <Resumen $gap={2}>
        <Card>
          <MutedText>Usuarios</MutedText>
          <StatNumber>{usuarios?.length || 0}</StatNumber>
        </Card>
        <Card>
          <MutedText>Posts</MutedText>
          <StatNumber>{posts?.length || 0}</StatNumber>
        </Card>
        <Button as={Link} to="/transacciones" $variant="secondary">
          Ver todas las transacciones
        </Button>
      </Resumen>

      <SectionTitle>Usuarios</SectionTitle>
      {cargandoUsuarios ? (
        <Loading />
      ) : (
        <Stack $gap={1.25}>
          {usuarios?.map((u) => (
            <Card key={u._id}>
              <Flex $justify="space-between" $wrap>
                <Flex $gap={1.5}>
                  <Avatar nombre={u.nombre} fotoPerfil={u.fotoPerfil} />
                  <div>
                    <strong>
                      {u.nombre} {u.apellido}
                    </strong>{" "}
                    <Badge>{u.role}</Badge>
                    <MutedText>{u.email}</MutedText>
                  </div>
                </Flex>
                <Flex $gap={1}>
                  {u.role === "Freelancer" && (
                    <Button
                      type="button"
                      $variant="secondary"
                      onClick={() =>
                        verificarMutation.mutate({ id: u._id, verificado: !u.verificado })
                      }
                    >
                      {u.verificado ? "Desverificar" : "Verificar"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    $variant="danger"
                    onClick={() => desactivarMutation.mutate(u._id)}
                  >
                    Desactivar
                  </Button>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Stack>
      )}

      <SubSeccion>Moderar posts</SubSeccion>
      {cargandoPosts ? (
        <Loading />
      ) : posts?.length ? (
        <Stack $gap={1.25}>
          {posts.map((post) => (
            <Card key={post._id}>
              <Flex $justify="space-between" $wrap>
                <div>
                  <strong>
                    {post.autor_id?.nombre} {post.autor_id?.apellido}
                  </strong>
                  <p>{post.contenido}</p>
                </div>
                <Button
                  type="button"
                  $variant="danger"
                  onClick={() => borrarPostMutation.mutate(post._id)}
                >
                  Eliminar
                </Button>
              </Flex>
            </Card>
          ))}
        </Stack>
      ) : (
        <EmptyState>No hay posts publicados.</EmptyState>
      )}
    </PageContainer>
  );
};

export default AdminPanel;
