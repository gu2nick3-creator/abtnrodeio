import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArenaStore } from "@/lib/arenaStore";

const TropeirosPage = () => {
  const { data } = useArenaStore();
  const [search, setSearch] = useState("");

  const filtered = data.tropeiros.filter((t) =>
    `${t.name} ${t.team} ${t.city}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wider text-gradient-gold mb-2">
            Tropeiros
          </h1>

          <p className="text-muted-foreground mb-8">
            Consulte os profissionais cadastrados.
          </p>

          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-gold rounded-lg px-10 py-3"
              placeholder="Buscar tropeiro..."
            />
          </div>

          {!filtered.length ? (
            <p className="text-muted-foreground border border-dashed border-gold rounded-xl p-10 text-center">
              Nenhum tropeiro cadastrado.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((t) => (
                <Link
                  key={t.id}
                  to={`/tropeiros/${t.id}`}
                  className="bg-card border border-gold rounded-xl p-6 hover:shadow-gold transition-shadow"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-muted mb-4">
                    <img
                      src={t.image || "/placeholder.svg"}
                      alt={t.name}
                      className="w-full h-full"
                      style={{
                        objectFit:
                          t.image_fit === "contain"
                            ? "contain"
                            : t.image_fit === "fill"
                            ? "fill"
                            : "cover",
                        objectPosition: t.image_fit === "cover-top" ? "top" : "center",
                      }}
                    />
                  </div>

                  <h3 className="text-xl font-semibold uppercase">{t.name}</h3>
                  <p className="text-primary text-sm mt-1">{t.team}</p>
                  <p className="text-muted-foreground text-sm mt-2">{t.city}</p>
                  <p className="text-muted-foreground text-sm">
                    {t.bullCount} touros cadastrados
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TropeirosPage;
