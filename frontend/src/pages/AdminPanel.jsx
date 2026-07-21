import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import usuarioService from "../services/usuarioService";
import postService from "../services/postService";
import Loading from "../components/common/Loading";
import Avatar from "../components/common/Avatar";
import { PageContainer, PageTitle, SectionTitle, Card, Badge, Button, Flex, EmptyState } from "../styles/ui";

const AdminPanel = () => {
  const queryClient = useQueryClient();

  const { data: usuarios, isLoading: cargandoUsuarios } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => usuarioService.getAll(),
  });

  const { data: posts, isLoading: cargandoPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getAll(),
  });

  const verificarMutation = useMutation({
    mutationFn: ({ id, verificado }) => usuarioService.update(id, { verificado }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Estado de verificación actualizado");
    },
    onError: (error) => toast.error(error.message),
  });

  const desactivarMutation = useMutation({
    mutationFn: (id) => usuarioService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success("Usuario desactivado");
    },
    onError: (error) => toast.error(error.message),
  });

  const borrarPostMutation = useMutation({
    mutationFn: (id) => postService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post eliminado");
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <PageContainer>
      <PageTitle>Panel de administración</PageTitle>

      <Flex $gap={2} style={{ marginBottom: "20px" }}>
        <Card>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>Usuarios</p>
          <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>{usuarios?.length || 0}</p>
        </Card>
        <Card>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>Posts</p>
          <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>{posts?.length || 0}</p>
        </Card>
        <Button as={Link} to="/transacciones" $variant="secondary">
          Ver todas las transacciones
        </Button>
      </Flex>

      <SectionTitle>Usuarios</SectionTitle>
      {cargandoUsuarios ? (
        <Loading />
      ) : (
        usuarios?.map((u) => (
          <Card key={u._id} style={{ marginBottom: "10px" }}>
            <Flex $justify="space-between" $wrap>
              <Flex $gap={1.5}>
                <Avatar nombre={u.nombre} fotoPerfil={u.fotoPerfil} />
                <div>
                  <strong>
                    {u.nombre} {u.apellido}
                  </strong>{" "}
                  <Badge>{u.role}</Badge>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>{u.email}</p>
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
                <Button type="button" $variant="danger" onClick={() => desactivarMutation.mutate(u._id)}>
                  Desactivar
                </Button>
              </Flex>
            </Flex>
          </Card>
        ))
      )}

      <SectionTitle style={{ marginTop: "28px" }}>Moderar posts</SectionTitle>
      {cargandoPosts ? (
        <Loading />
      ) : posts?.length ? (
        posts.map((post) => (
          <Card key={post._id} style={{ marginBottom: "10px" }}>
            <Flex $justify="space-between" $wrap>
              <div>
                <strong>
                  {post.autor_id?.nombre} {post.autor_id?.apellido}
                </strong>
                <p style={{ margin: "4px 0 0" }}>{post.contenido}</p>
              </div>
              <Button type="button" $variant="danger" onClick={() => borrarPostMutation.mutate(post._id)}>
                Eliminar
              </Button>
            </Flex>
          </Card>
        ))
      ) : (
        <EmptyState>No hay posts publicados.</EmptyState>
      )}
    </PageContainer>
  );
};

export default AdminPanel;
