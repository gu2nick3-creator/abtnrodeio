import { Link } from "react-router-dom";
import bullLogo from "@/assets/abtn-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-gold bg-card mt-20">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={bullLogo} alt="ABTN" className="h-10 w-10" />
            <div>
              <p className="text-xl font-semibold text-gradient-gold">ABTN</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Provas e avaliação de touros</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Plataforma para cadastro, organização e exibição de tropeiros, touros e eventos.</p>
        </div>
        <div>
          <h4 className="uppercase text-primary text-sm tracking-wider mb-4">Navegação</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/">Início</Link><br />
            <Link to="/touros">Touros</Link><br />
            <Link to="/tropeiros">Tropeiros</Link><br />
            <Link to="/eventos">Eventos</Link>
          </div>
        </div>
        <div>
          <h4 className="uppercase text-primary text-sm tracking-wider mb-4">Plataforma</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/galeria">Galeria</Link><br />
            <Link to="/login">Login tropeiro</Link><br />
            <Link to="/admin">Painel admin</Link>
          </div>
        </div>
        <div>
          <h4 className="uppercase text-primary text-sm tracking-wider mb-4">Contato</h4>
          <p className="text-sm text-muted-foreground">Cadastre seus dados reais no painel para substituir estes campos.</p>
        </div>
      </div>
      <div className="border-t border-gold/50 py-4 text-center text-xs text-muted-foreground">© 2026 ABTN. Todos os direitos reservados.</div>
    </footer>
  );
};

export default Footer;
