import { motion } from "framer-motion";
import { ArrowRight, Instagram, MapPin, ShieldCheck, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cards = [
  {
    icon: Trophy,
    title: "Plataforma oficial",
    text: "Ambiente criado para reunir tropeiros, touros e eventos com organização e autoridade no segmento.",
  },
  {
    icon: ShieldCheck,
    title: "Gestão centralizada",
    text: "Cadastros, avaliações e acessos administrados de forma simples, mantendo a plataforma padronizada e profissional.",
  },
  {
    icon: MapPin,
    title: "Presença no rodeio",
    text: "A ABTN conecta informação, visibilidade e credibilidade para quem vive o universo das provas e avaliações.",
  },
];

const ContatoPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <section className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto rounded-[32px] border border-gold/40 bg-card/60 backdrop-blur-sm overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-8 md:p-12 lg:p-14">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <span className="inline-flex items-center rounded-full border border-gold/40 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-primary mb-6">
                    contato institucional
                  </span>
                  <h1 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider text-gradient-gold mb-5">
                    ABTN em evidência no rodeio
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    Uma presença digital criada para valorizar tropeiros, destacar touros e fortalecer eventos com um visual forte,
                    organização profissional e identidade marcante.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href="https://instagram.com/abtnrodeio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="w-4 h-4" /> Instagram oficial
                    </a>
                    <Link
                      to="/tropeiros"
                      className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary hover:bg-primary/10 transition-colors"
                    >
                      Ver tropeiros <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-gold/20 bg-gradient-to-b from-primary/10 to-transparent p-8 md:p-10 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-primary mb-2">Instagram</p>
                    <p className="text-2xl font-display font-semibold text-foreground">@abtnrodeio</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-primary mb-2">Suporte</p>
                    <a
                      href="https://wa.me/5563998655545"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      Suporte no WhatsApp
                    </a>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-primary mb-2">Cidade</p>
                    <p className="text-lg text-muted-foreground">Colinas do Tocantins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-10">
            {cards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-3xl border border-gold/25 bg-card/55 p-7 shadow-[0_10px_40px_rgba(0,0,0,0.22)]"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/12 border border-gold/30 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">{card.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{card.text}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContatoPage;
