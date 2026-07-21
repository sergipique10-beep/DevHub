import { useQuery } from "@tanstack/react-query";
import postService from "../../services/postService";
import { useAuth } from "../../context/AuthContext";
import CrearPost from "./CrearPost";
import PostCard from "./PostCard";
import Loading from "../common/Loading";
import { Card, EmptyState } from "../../styles/ui";

const Feed = () => {
  const { usuario } = useAuth();
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => postService.getAll(),
  });

  return (
    <div>
      {usuario && (
        <Card style={{ marginBottom: "20px" }}>
          <CrearPost />
        </Card>
      )}

      {isLoading ? (
        <Loading />
      ) : posts?.length ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <EmptyState>Todavía no hay publicaciones en el feed.</EmptyState>
      )}
    </div>
  );
};

export default Feed;
