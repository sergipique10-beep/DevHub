import EditarPerfil from "../components/Perfil/EditarPerfil";
import { PageContainer, PageTitle, Card } from "../styles/ui";

const EditarPerfilPage = () => (
  <PageContainer $max="560px">
    <PageTitle>Editar perfil</PageTitle>
    <Card>
      <EditarPerfil />
    </Card>
  </PageContainer>
);

export default EditarPerfilPage;
