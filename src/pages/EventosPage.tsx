import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArenaStore } from "@/lib/arenaStore";

const EventosPage = () => {
  const { data } = useArenaStore();
  const [filter, setFilter] = useState("Todos");
  const filters = ["Todos", "Em breve", "Em andamento", "Encerrado"];
  const filtered = data.events.filter((event) => filter === "Todos" ? true : event.status === filter);
  return <div className="min-h-screen bg-background"><Header /><main className="pt-24 pb-20"><div className="container mx-auto px-4"><h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wider text-gradient-gold mb-2">Eventos</h1><p className="text-muted-foreground mb-8">Calendário e resultados cadastrados no painel.</p><div className="flex flex-wrap gap-3 mb-8">{filters.map((f) => <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg border ${filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-card border-gold text-muted-foreground"}`}>{f}</button>)}</div>{!filtered.length ? <p className="text-muted-foreground border border-dashed border-gold rounded-xl p-10 text-center">Nenhum evento cadastrado.</p> : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">{filtered.map((evt) => <Link key={evt.id} to={`/eventos/${evt.id}`} className="bg-card border border-gold rounded-xl overflow-hidden hover:shadow-gold transition-shadow"><div className="h-56 bg-muted"><img src={evt.image || "/placeholder.svg"} alt={evt.name} className="w-full h-full object-cover" /></div><div className="p-6"><div className="flex items-start justify-between gap-3"><h3 className="text-lg font-semibold uppercase">{evt.name}</h3><span className="text-xs uppercase px-2 py-1 rounded bg-primary/20 text-primary">{evt.status}</span></div><p className="text-muted-foreground text-sm mt-3">{evt.date} até {evt.dateEnd}</p><p className="text-muted-foreground text-sm">{evt.location} • {evt.city}</p></div></Link>)}</div>}</div></main><Footer /></div>;
};

export default EventosPage;
