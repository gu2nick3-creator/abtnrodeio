import { useState } from "react";
import { Navigate } from "react-router-dom";
import { KeyRound, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArenaStore } from "@/lib/arenaStore";

const LoginPage = () => {
  const { session, loginTropeiro } = useArenaStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (session?.role === "tropeiro") {
    return <Navigate to={`/tropeiros/${session.tropeiroId}`} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-card border border-gold rounded-2xl p-8 lg:p-10 shadow-[0_0_40px_rgba(212,175,55,0.08)]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gradient-gold">Login de tropeiro</h1>
                <p className="text-sm text-muted-foreground">Acesso criado pelo administrador no painel.</p>
              </div>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const result = loginTropeiro(username, password);
                if (!result.ok) setError(result.message);
              }}
            >
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Usuário</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-background border border-gold rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary" placeholder="Digite seu usuário" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-muted-foreground">Senha</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-background border border-gold rounded-lg px-4 py-3 outline-none focus:ring-1 focus:ring-primary" placeholder="Digite sua senha" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" className="w-full bg-gradient-gold text-primary-foreground rounded-lg py-3 font-semibold transition-opacity hover:opacity-90 flex items-center justify-center gap-2">
                <KeyRound className="w-4 h-4" /> Entrar
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
