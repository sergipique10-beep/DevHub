import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { FiHeart, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import postService from "../../services/postService";
import { useAuth } from "../../context/AuthContext";
import useMutacion from "../../hooks/useMutacion";
import Avatar from "../common/Avatar";
import { Card, Flex, Input, Button, MutedText, Thumb } from "../../styles/ui";
import { formatearFecha } from "../../utils/parse";

const Contenido = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1.5)};
  white-space: pre-wrap;
`;

const Imagen = styled(Thumb)`
  height: auto;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const BotonIcono = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-weight: 600;
  color: ${({ theme, $activo }) => ($activo ? theme.colors.danger : theme.colors.textMuted)};
`;

const Acciones = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing(1.5)};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Comentarios = styled.div`
  margin-top: ${({ theme }) => theme.spacing(1.25)};
  padding-top: ${({ theme }) => theme.spacing(1.25)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Comentario = styled.p`
  font-size: 0.9rem;
  margin: 4px 0;
`;

const NuevoComentario = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing(1.25)};
`;

const PostCard = ({ post }) => {
  const { usuario } = useAuth();
  const [comentario, setComentario] = useState("");

  const likeMutation = useMutacion({
    mutationFn: () => postService.toggleLike(post._id),
    invalidar: [["posts"]],
  });

  const comentarMutation = useMutacion({
    mutationFn: (contenido) => postService.agregarComentario(post._id, contenido),
    invalidar: [["posts"]],
    onSuccess: () => setComentario(""),
  });

  const eliminarMutation = useMutacion({
    mutationFn: () => postService.remove(post._id),
    exito: "Post eliminado",
    invalidar: [["posts"]],
  });

  const meGusta = usuario && post.likes?.includes(usuario.id);
  const puedeBorrar = usuario && (usuario.id === post.autor_id?._id || usuario.role === "Admin");

  return (
    <Card>
      <Flex $justify="space-between">
        <Flex $gap={1.5}>
          <Avatar nombre={post.autor_id?.nombre} fotoPerfil={post.autor_id?.fotoPerfil} />
          <div>
            <Link to={`/perfil/${post.autor_id?._id}`}>
              <strong>
                {post.autor_id?.nombre} {post.autor_id?.apellido}
              </strong>
            </Link>
            <MutedText $size="0.8rem">{formatearFecha(post.createdAt)}</MutedText>
          </div>
        </Flex>
        {puedeBorrar && (
          <BotonIcono
            type="button"
            onClick={() => eliminarMutation.mutate()}
            aria-label="Eliminar post"
          >
            <FiTrash2 />
          </BotonIcono>
        )}
      </Flex>

      <Contenido>{post.contenido}</Contenido>
      {post.imagen && <Imagen src={post.imagen} alt="" />}

      <Acciones $gap={2}>
        <BotonIcono
          type="button"
          $activo={meGusta}
          aria-pressed={Boolean(meGusta)}
          onClick={() =>
            usuario ? likeMutation.mutate() : toast.info("Inicia sesión para dar like")
          }
        >
          <FiHeart fill={meGusta ? "currentColor" : "none"} /> {post.likes?.length || 0}
        </BotonIcono>
        <Flex $gap={0.75}>
          <FiMessageCircle /> {post.comentarios?.length || 0}
        </Flex>
      </Acciones>

      {post.comentarios?.length > 0 && (
        <Comentarios>
          {post.comentarios.map((c) => (
            <Comentario key={c._id}>
              <strong>
                {c.usuario_id?.nombre} {c.usuario_id?.apellido}:
              </strong>{" "}
              {c.contenido}
            </Comentario>
          ))}
        </Comentarios>
      )}

      {usuario && (
        <NuevoComentario $gap={1}>
          <Input
            placeholder="Escribe un comentario..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && comentario.trim()) comentarMutation.mutate(comentario);
            }}
          />
          <Button
            type="button"
            $variant="secondary"
            disabled={!comentario.trim() || comentarMutation.isPending}
            onClick={() => comentarMutation.mutate(comentario)}
          >
            Comentar
          </Button>
        </NuevoComentario>
      )}
    </Card>
  );
};

export default PostCard;
