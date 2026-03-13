import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArenaStore } from "@/lib/arenaStore";

const TourosPage = () => {
  const { data } = useArenaStore();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => data.bulls.filter((bull) => `${bull.name} ${bull.tropeiro} ${bull.city}`.toLowerCase().includes(search.toLowerCase())), [data.bulls, search]);
  return <div className="min-h-screen bg-background"><Header /><main className="pt-24 pb-20"><div className="container mx-auto px-4"><h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wider text-gradient-gold mb-2">Touros</h1><p className="text-muted-foreground mb-8">Busca por nome, tropeiro ou cidade.</p><div className="relative max-w-md mb-8"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-card border border-gold rounded-lg px-10 py-3" placeholder="Buscar touro..." /></div>{!filtered.length ? <p className="text-muted-foreground border border-dashed border-gold rounded-xl p-10 text-center">Nenhum touro cadastrado.</p> : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">{filtered.map((bull) => <Link key={bull.id} to={`/touros/${bull.id}`} className="bg-card border border-gold rounded-xl overflow-hidden hover:shadow-gold transition-shadow"><div className="h-60 bg-muted"><img src={bull.image || "/placeholder.svg"} alt={bull.name} className="w-full h-full object-cover" /></div><div className="p-6"><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold uppercase">{bull.name}</h3><span className="flex items-center gap-1 text-primary font-bold"><Star className="w-4 h-4 fill-primary" />{bull.score}</span></div><p className="text-muted-foreground text-sm mt-2">{bull.tropeiro}</p><p className="text-muted-foreground text-sm">{bull.city}</p></div></Link>)}</div>}</div></main><Footer /></div>;
};

export default TourosPage;
