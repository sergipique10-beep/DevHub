import { useNavigate } from "react-router-dom";
import ServicioForm from "../components/Freelancer/ServicioForm";
import { PageContainer, PageTitle, Card } from "../styles/ui";

const CrearServicio = () => {
  const navigate = useNavigate();
  return (
    <PageContainer style={{ maxWidth: "620px" }}>
      <PageTitle>Publicar un servicio</PageTitle>
      <Card>
        <ServicioForm onSuccess={() => navigate("/mis-servicios")} />
      </Card>
    </PageContainer>
  );
};

export default CrearServicio;
