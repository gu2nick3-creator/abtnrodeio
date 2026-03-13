import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import TourosPage from "./pages/TourosPage.tsx";
import BullProfilePage from "./pages/BullProfilePage.tsx";
import TropeirosPage from "./pages/TropeirosPage.tsx";
import TropeiroProfilePage from "./pages/TropeiroProfilePage.tsx";
import EventosPage from "./pages/EventosPage.tsx";
import EventProfilePage from "./pages/EventProfilePage.tsx";
import GaleriaPage from "./pages/GaleriaPage.tsx";
import ContatoPage from "./pages/ContatoPage.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import AdminLoginPage from "./pages/AdminLoginPage.tsx";
import { ArenaStoreProvider } from "@/lib/arenaStore";
import {
  AdminTropeiros, AdminTouros, AdminEventos, AdminAvaliacoes,
  AdminFotos, AdminVideos, AdminUsuarios,
} from "./pages/admin/AdminPages.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ArenaStoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/touros" element={<TourosPage />} />
            <Route path="/touros/:id" element={<BullProfilePage />} />
            <Route path="/tropeiros" element={<TropeirosPage />} />
            <Route path="/tropeiros/:id" element={<TropeiroProfilePage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/eventos/:id" element={<EventProfilePage />} />
            <Route path="/galeria" element={<GaleriaPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tropeiros" element={<AdminTropeiros />} />
            <Route path="/admin/touros" element={<AdminTouros />} />
            <Route path="/admin/eventos" element={<AdminEventos />} />
            <Route path="/admin/avaliacoes" element={<AdminAvaliacoes />} />
            <Route path="/admin/fotos" element={<AdminFotos />} />
            <Route path="/admin/videos" element={<AdminVideos />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ArenaStoreProvider>
  </QueryClientProvider>
);

export default App;
