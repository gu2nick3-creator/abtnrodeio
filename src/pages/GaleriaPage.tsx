import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArenaStore } from "@/lib/arenaStore";

const GaleriaPage = () => {
  const { data } = useArenaStore();
  const categories = ["all", ...Array.from(new Set(data.gallery.map((g) => g.category).filter(Boolean)))];
  const [category, setCategory] = useState("all");
  const filtered = data.gallery.filter((item) => category === "all" || item.category === category);
  return <div className="min-h-screen bg-background"><Header /><main className="pt-24 pb-20"><div className="container mx-auto px-4"><h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wider text-gradient-gold mb-2">Galeria</h1><p className="text-muted-foreground mb-8">Fotos e vídeos cadastrados no painel.</p><div className="flex flex-wrap gap-3 mb-8">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-lg border ${category === c ? "bg-primary text-primary-foreground border-primary" : "bg-card border-gold text-muted-foreground"}`}>{c === "all" ? "Todos" : c}</button>)}</div>{!filtered.length ? <p className="text-muted-foreground border border-dashed border-gold rounded-xl p-10 text-center">Nenhum item na galeria.</p> : <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">{filtered.map((item) => <div key={item.id} className="bg-card border border-gold rounded-xl overflow-hidden"><div className="h-64 bg-muted">{item.type === "video" ? <video src={item.url} controls className="w-full h-full object-cover" /> : <img src={item.url || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />}</div><div className="p-5"><p className="font-semibold">{item.title}</p><p className="text-sm text-muted-foreground mt-1">{item.category}</p></div></div>)}</div>}</div></main><Footer /></div>;
};

export default GaleriaPage;
