import { Link, useLocation } from "react-router-dom";
import { Menu, Shield, User, X } from "lucide-react";
import bullLogo from "@/assets/abtn-logo.png";
import { useArenaStore } from "@/lib/arenaStore";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const { session, logout } = useArenaStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Início", path: "/" },
    { label: "Touros", path: "/touros" },
    { label: "Tropeiros", path: "/tropeiros" },
    { label: "Eventos", path: "/eventos" },
    { label: "Galeria", path: "/galeria" },
    { label: "Contato", path: "/contato" },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-3 md:px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="rounded-[24px] border border-gold/40 bg-background/88 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] px-3 py-2.5 md:px-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-3 pr-2" onClick={closeMobile}>
              <img src={bullLogo} alt="ABTN" className="h-10 w-10 rounded-full object-cover border border-gold/40 md:h-11 md:w-11" />
              <div className="min-w-0 leading-none">
                <div className="truncate text-xl font-semibold text-gradient-gold md:text-2xl">ABTN</div>
                <div className="hidden text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:block whitespace-nowrap">
                  Revelando campeões
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 rounded-full border border-gold/30 bg-card/50 px-2 py-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-gradient-gold text-primary-foreground shadow-[0_0_20px_rgba(212,175,55,0.22)]"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/10",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <Link
                to="/admin-login"
                className="w-11 h-11 rounded-full border border-gold/50 bg-card/60 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                aria-label="Entrar no painel administrativo"
              >
                <Shield className="w-4 h-4" />
              </Link>

              {session ? (
                <div className="flex items-center gap-2">
                  {session.role === "tropeiro" && session.tropeiroId ? (
                    <Link
                      to={`/tropeiros/${session.tropeiroId}`}
                      className="hidden xl:inline-flex px-4 py-2 rounded-full border border-gold/40 text-sm text-primary hover:bg-primary/10 transition-colors"
                    >
                      Minha página
                    </Link>
                  ) : session.role === "admin" ? (
                    <Link
                      to="/admin"
                      className="hidden xl:inline-flex px-4 py-2 rounded-full border border-gold/40 text-sm text-primary hover:bg-primary/10 transition-colors"
                    >
                      Painel admin
                    </Link>
                  ) : null}
                  <button
                    onClick={logout}
                    className="bg-gradient-gold text-primary-foreground text-sm uppercase tracking-wider px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-gold text-primary-foreground text-sm uppercase tracking-wider px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  Entrar
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden shrink-0">
              <Link
                to="/admin-login"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-card/60 text-primary"
                aria-label="Entrar no painel administrativo"
              >
                <Shield className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-card/60 text-primary"
                aria-label="Abrir menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="mt-3 border-t border-gold/20 pt-3 lg:hidden">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeMobile}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "border-gold bg-gradient-gold text-primary-foreground"
                          : "border-gold/20 bg-card/50 text-foreground/85 hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-3 flex flex-col gap-2">
                {session ? (
                  <>
                    {session.role === "tropeiro" && session.tropeiroId ? (
                      <Link
                        to={`/tropeiros/${session.tropeiroId}`}
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-card/50 px-4 py-3 text-sm font-medium text-primary"
                      >
                        <User className="h-4 w-4" /> Minha página
                      </Link>
                    ) : session.role === "admin" ? (
                      <Link
                        to="/admin"
                        onClick={closeMobile}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gold/30 bg-card/50 px-4 py-3 text-sm font-medium text-primary"
                      >
                        <Shield className="h-4 w-4" /> Painel admin
                      </Link>
                    ) : null}
                    <button
                      onClick={() => {
                        logout();
                        closeMobile();
                      }}
                      className="rounded-2xl bg-gradient-gold px-4 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="rounded-2xl bg-gradient-gold px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider text-primary-foreground"
                  >
                    Entrar
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
