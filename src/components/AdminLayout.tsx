import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Beef,
  CalendarDays,
  Star,
  Image,
  Film,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import bullLogo from "@/assets/abtn-logo.png";
import { useArenaStore } from "@/lib/arenaStore";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Tropeiros", path: "/admin/tropeiros", icon: Users },
  { label: "Touros", path: "/admin/touros", icon: Beef },
  { label: "Eventos", path: "/admin/eventos", icon: CalendarDays },
  { label: "Avaliações", path: "/admin/avaliacoes", icon: Star },
  { label: "Fotos", path: "/admin/fotos", icon: Image },
  { label: "Vídeos", path: "/admin/videos", icon: Film },
  { label: "Usuários", path: "/admin/usuarios", icon: Settings },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { session, logout } = useArenaStore();

  if (session?.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-card border-r border-gold flex flex-col transition-all duration-300 flex-shrink-0`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-gold">
          <img src={bullLogo} alt="ABTN" className="h-8 w-8 flex-shrink-0" />
          {!collapsed && (
            <div>
              <p className="font-display text-sm font-bold text-gradient-gold">ABTN</p>
              <p className="text-[8px] uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && (
                  <span className="font-display uppercase tracking-wider text-xs">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gold p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Recolher</span>
              </>
            )}
          </button>
        </div>

        <div className="border-t border-gold p-2">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 p-2 text-muted-foreground hover:text-foreground transition-colors justify-center"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="text-xs">Sair</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="h-14 border-b border-gold flex items-center px-6 bg-card">
          <h2 className="font-display text-sm uppercase tracking-wider text-foreground">
            Painel Administrativo
          </h2>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
