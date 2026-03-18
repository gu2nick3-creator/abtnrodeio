import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { useArenaStore } from "@/lib/arenaStore";

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-semibold uppercase tracking-wider text-gradient-gold mb-2">{title}</h2>
    <div className="h-[2px] w-16 bg-gradient-gold mx-auto mb-3" />
    <p className="text-muted-foreground">{subtitle}</p>
  </div>
);

const EmptyState = ({ text }: { text: string }) => <p className="text-center text-muted-foreground border border-dashed border-gold rounded-xl p-8">{text}</p>;

export const FeaturedBulls = () => {
  const { data } = useArenaStore();
  const bulls = [...data.bulls].sort((a, b) => b.score - a.score).slice(0, 4);
  return (
    <section className="py-20 bg-gradient-arena">
      <div className="container mx-auto px-4">
        <SectionTitle title="Touros em destaque" subtitle="Os melhores avaliados cadastrados na plataforma" />
        {!bulls.length ? <EmptyState text="Nenhum touro cadastrado ainda." /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bulls.map((bull) => (
              <Link key={bull.id} to={`/touros/${bull.id}`} className="bg-card border border-gold rounded-lg p-6 hover:shadow-gold transition-shadow group">
                <div className="w-full h-40 bg-muted rounded mb-4 overflow-hidden">
                  <img src={bull.image || "/placeholder.svg"} alt={bull.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-semibold uppercase text-foreground group-hover:text-primary transition-colors">{bull.name}</h3>
                <div className="flex items-center gap-1 mt-2"><Star className="w-4 h-4 text-primary fill-primary" /><span className="text-primary font-bold text-lg">{bull.score}</span></div>
                <p className="text-muted-foreground text-sm mt-1">{bull.tropeiro}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export const FeaturedTropeiros = () => {
  const { data } = useArenaStore();
  const tropeiros = data.tropeiros.slice(0, 3);
  return (
    <section className="py-20"><div className="container mx-auto px-4"><SectionTitle title="Tropeiros" subtitle="Profissionais cadastrados na plataforma" />
      {!tropeiros.length ? <EmptyState text="Nenhum tropeiro cadastrado ainda." /> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{tropeiros.map((t) => (
        <Link key={t.id} to={`/tropeiros/${t.id}`} className="bg-card border border-gold rounded-lg p-6 text-center hover:shadow-gold transition-shadow">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 overflow-hidden"><img src={t.image || "/placeholder.svg"} alt={t.name} className="w-full h-full object-cover" /></div>
          <h3 className="text-lg font-semibold uppercase text-foreground">{t.name}</h3><p className="text-primary text-sm mt-1">{t.team}</p><p className="text-muted-foreground text-sm mt-2">{t.bullCount} touros cadastrados</p>
        </Link>))}</div>}
    </div></section>
  );
};

export const UpcomingEvents = () => {
  const { data } = useArenaStore();
  const events = data.events.slice(0, 3);
  return (
    <section className="py-20 bg-gradient-arena"><div className="container mx-auto px-4"><SectionTitle title="Eventos" subtitle="Próximas provas e competições" />
      {!events.length ? <EmptyState text="Nenhum evento cadastrado ainda." /> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{events.map((evt) => (
        <Link key={evt.id} to={`/eventos/${evt.id}`} className="bg-card border border-gold rounded-lg p-6 hover:shadow-gold transition-shadow">
          <div className="flex justify-between items-start mb-4 gap-2"><h3 className="text-lg font-semibold uppercase text-foreground">{evt.name}</h3><span className="text-xs uppercase px-2 py-1 rounded bg-primary/20 text-primary">{evt.status}</span></div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><MapPin className="w-4 h-4 text-primary" />{evt.location}</div><p className="text-muted-foreground text-sm mt-2">{evt.date}</p>
        </Link>))}</div>}
    </div></section>
  );
};


export const AboutSection = () => (
  <section className="py-20 bg-gradient-arena">
    <div className="container mx-auto px-4 text-center max-w-3xl">
      <SectionTitle title="Sobre a plataforma" subtitle="Organização, credibilidade e gestão para o rodeio" />
      <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-muted-foreground leading-relaxed text-lg">
        A ABTN centraliza cadastro de tropeiros, touros, eventos, fotos, vídeos e avaliações em um só lugar. O painel administrativo controla tudo, e o login dos tropeiros pode ser criado pelo próprio administrador.
      </motion.p>
    </div>
  </section>
);
