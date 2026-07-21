import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FiHeart, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import postService from "../../services/postService";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";
import { Card, Flex, Input, Button } from "../../styles/ui";
import { formatearFecha } from "../../utils/parse";

const PostCard = ({ post }) => {
  const { usuario } = useAuth();
  const queryClient = useQueryClient();
  const [comentario, setComentario] = useState("");

  const invalidar = () => queryClient.invalidateQueries({ queryKey: ["posts"] });

  const likeMutation = useMutation({
    mutationFn: () => postService.toggleLike(post._id),
    onSuccess: invalidar,
    onError: (error) => toast.error(error.message),
  });

  const comentarMutation = useMutation({
    mutationFn: (contenido) => postService.agregarComentario(post._id, contenido),
    onSuccess: () => {
      setComentario("");
      invalidar();
    },
    onError: (error) => toast.error(error.message),
  });

  const eliminarMutation = useMutation({
    mutationFn: () => postService.remove(post._id),
    onSuccess: invalidar,
    onError: (error) => toast.error(error.message),
  });

  const meGusta = usuario && post.likes?.includes(usuario.id);
  const puedeBorrar = usuario && (usuario.id === post.autor_id?._id || usuario.role === "Admin");

  return (
    <Card style={{ marginBottom: "16px" }}>
      <Flex $justify="space-between">
        <Flex $gap={1.5}>
          <Avatar nombre={post.autor_id?.nombre} fotoPerfil={post.autor_id?.fotoPerfil} />
          <div>
            <Link to={`/perfil/${post.autor_id?._id}`}>
              <strong>
                {post.autor_id?.nombre} {post.autor_id?.apellido}
              </strong>
            </Link>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>
              {formatearFecha(post.createdAt)}
            </p>
          </div>
        </Flex>
        {puedeBorrar && (
          <button
            type="button"
            onClick={() => eliminarMutation.mutate()}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
            aria-label="Eliminar post"
          >
            <FiTrash2 />
          </button>
        )}
      </Flex>

      <p style={{ marginTop: "12px", whiteSpace: "pre-wrap" }}>{post.contenido}</p>
      {post.imagen && (
        <img
          src={post.imagen}
          alt=""
          style={{ width: "100%", borderRadius: "8px", marginTop: "8px" }}
        />
      )}

      <Flex $gap={2} style={{ marginTop: "12px", color: "#94a3b8" }}>
        <button
          type="button"
          onClick={() => (usuario ? likeMutation.mutate() : toast.info("Inicia sesión para dar like"))}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: meGusta ? "#fb7185" : "#94a3b8",
            fontWeight: 600,
          }}
        >
          <FiHeart fill={meGusta ? "currentColor" : "none"} /> {post.likes?.length || 0}
        </button>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FiMessageCircle /> {post.comentarios?.length || 0}
        </span>
      </Flex>

      {post.comentarios?.length > 0 && (
        <div style={{ marginTop: "10px", borderTop: "1px solid rgba(148,163,184,0.18)", paddingTop: "10px" }}>
          {post.comentarios.map((c) => (
            <p key={c._id} style={{ fontSize: "0.9rem", margin: "4px 0" }}>
              <strong>
                {c.usuario_id?.nombre} {c.usuario_id?.apellido}:
              </strong>{" "}
              {c.contenido}
            </p>
          ))}
        </div>
      )}

      {usuario && (
        <Flex $gap={1} style={{ marginTop: "10px" }}>
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
        </Flex>
      )}
    </Card>
  );
};

export default PostCard;
