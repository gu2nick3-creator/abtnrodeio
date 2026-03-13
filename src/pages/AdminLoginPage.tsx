import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArenaStore } from "@/lib/arenaStore";

const AdminLoginPage = () => {
  const { session, loginAdmin, adminCredentials } = useArenaStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (session?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-gold rounded-2xl p-8 lg:p-10 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gradient-gold">Painel administrativo</h1>
                <p className="text-sm text-muted-foreground">Acesso restrito da administração da ABTN.</p>
              </div>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const result = loginAdmin(adminCredentials.username, password);
                if (!result.ok) setError(result.message);
              }}
            >
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Usuário</label>
                <input value={adminCredentials.username} disabled className="w-full bg-muted/50 border border-gold rounded-lg px-4 py-3 outline-none opacity-80 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-gold rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary" placeholder="Digite a senha do administrador" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" className="w-full bg-gradient-gold text-primary-foreground rounded-lg py-3 font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-2">
                <LockKeyhole className="w-4 h-4" /> Entrar no painel
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
