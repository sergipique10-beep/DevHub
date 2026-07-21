import Feed from "../components/Social/Feed";
import { PageContainer, PageTitle } from "../styles/ui";

const FeedPage = () => (
  <PageContainer style={{ maxWidth: "640px" }}>
    <PageTitle>Feed</PageTitle>
    <Feed />
  </PageContainer>
);

export default FeedPage;
