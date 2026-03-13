import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArenaStore } from "@/lib/arenaStore";

const TropeiroProfilePage = () => {
  const { id } = useParams();
  const { data, session } = useArenaStore();
  const tropeiro = data.tropeiros.find((item) => item.id === Number(id));
  const bulls = data.bulls.filter((bull) => bull.tropeiroId === Number(id));
  if (!tropeiro) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Tropeiro não encontrado.</div>;
  const isOwner = session?.tropeiroId === tropeiro.id;
  return <div className="min-h-screen bg-background"><Header /><main className="pt-24 pb-20"><div className="container mx-auto px-4 grid lg:grid-cols-[320px_1fr] gap-8"><aside className="bg-card border border-gold rounded-xl p-6 h-fit"><div className="w-32 h-32 rounded-full overflow-hidden bg-muted mx-auto mb-4"><img src={tropeiro.image || "/placeholder.svg"} alt={tropeiro.name} className="w-full h-full object-cover" /></div><h1 className="text-2xl font-semibold uppercase text-gradient-gold text-center">{tropeiro.name}</h1>{isOwner && <p className="text-center text-primary text-sm mt-2">Você está logado nesta conta.</p>}<div className="space-y-3 mt-6 text-sm"><p><span className="text-muted-foreground">Equipe:</span> {tropeiro.team}</p><p><span className="text-muted-foreground">Cidade:</span> {tropeiro.city}</p><p><span className="text-muted-foreground">Telefone:</span> {tropeiro.phone || "—"}</p><p><span className="text-muted-foreground">Instagram:</span> {tropeiro.instagram || "—"}</p><p><span className="text-muted-foreground">Facebook:</span> {tropeiro.facebook || "—"}</p></div></aside><section><div className="bg-card border border-gold rounded-xl p-6 mb-6"><h2 className="text-2xl font-semibold mb-4">Sobre o tropeiro</h2><p className="text-muted-foreground leading-relaxed">{tropeiro.description || "Descrição ainda não cadastrada."}</p></div><div className="bg-card border border-gold rounded-xl p-6"><h2 className="text-2xl font-semibold mb-6">Touros vinculados</h2>{!bulls.length ? <p className="text-muted-foreground">Nenhum touro vinculado a este tropeiro.</p> : <div className="grid md:grid-cols-2 gap-4">{bulls.map((bull) => <div key={bull.id} className="border border-gold rounded-lg overflow-hidden bg-background"><div className="h-44"><img src={bull.image || "/placeholder.svg"} alt={bull.name} className="w-full h-full object-cover" /></div><div className="p-4"><h3 className="font-semibold uppercase">{bull.name}</h3><p className="text-primary font-bold mt-1">{bull.score}</p><p className="text-muted-foreground text-sm">{bull.company}</p></div></div>)}</div>}</div></section></div></main><Footer /></div>;
};

export default TropeiroProfilePage;
