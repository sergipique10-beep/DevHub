import CrearProyectoForm from "../components/Cliente/CrearProyectoForm";
import { PageContainer, PageTitle, Card } from "../styles/ui";

const CrearProyecto = () => (
  <PageContainer style={{ maxWidth: "620px" }}>
    <PageTitle>Publicar un proyecto</PageTitle>
    <Card>
      <CrearProyectoForm />
    </Card>
  </PageContainer>
);

export default CrearProyecto;
