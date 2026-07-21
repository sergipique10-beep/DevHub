import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Loading from "./components/common/Loading";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Exploradores from "./pages/Exploradores";
import Perfil from "./pages/Perfil";
import EditarPerfilPage from "./pages/EditarPerfilPage";
import MisServiciosPage from "./pages/MisServiciosPage";
import CrearServicio from "./pages/CrearServicio";
import MiPortfolioPage from "./pages/MiPortfolioPage";
import CrearProyecto from "./pages/CrearProyecto";
import MisProyectos from "./pages/MisProyectos";
import ProyectoDetalle from "./pages/ProyectoDetalle";
import PropuestasPage from "./pages/PropuestasPage";
import Transacciones from "./pages/Transacciones";
import Reviews from "./pages/Reviews";
import FeedPage from "./pages/FeedPage";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const Layout = ({ children }) => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Navbar />
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </div>
);

const RootRedirect = () => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Loading />;
  return <Navigate to={usuario ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/explorar" element={<Exploradores />} />
                <Route path="/perfil/:id" element={<Perfil />} />
                <Route path="/feed" element={<FeedPage />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/perfil/editar"
                  element={
                    <ProtectedRoute>
                      <EditarPerfilPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mis-proyectos"
                  element={
                    <ProtectedRoute>
                      <MisProyectos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proyectos/:id"
                  element={
                    <ProtectedRoute>
                      <ProyectoDetalle />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transacciones"
                  element={
                    <ProtectedRoute>
                      <Transacciones />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/mis-servicios"
                  element={
                    <ProtectedRoute roles={["Freelancer"]}>
                      <MisServiciosPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crear-servicio"
                  element={
                    <ProtectedRoute roles={["Freelancer"]}>
                      <CrearServicio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/mi-portfolio"
                  element={
                    <ProtectedRoute roles={["Freelancer"]}>
                      <MiPortfolioPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/propuestas"
                  element={
                    <ProtectedRoute roles={["Freelancer"]}>
                      <PropuestasPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute roles={["Freelancer"]}>
                      <Reviews />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/crear-proyecto"
                  element={
                    <ProtectedRoute roles={["Cliente"]}>
                      <CrearProyecto />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={["Admin"]}>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </BrowserRouter>
        <ToastContainer position="bottom-right" autoClose={4000} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
