import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-rodeo-new-full.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24 md:pt-28">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-background/40 to-background/78" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_48%)]" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-10 md:px-6 md:py-14">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-2 font-display text-5xl font-bold uppercase tracking-wider sm:text-6xl md:text-8xl">
              <span className="text-gradient-gold">ABTN</span>
            </h1>
            <div className="mx-auto mb-4 h-[2px] w-28 bg-gradient-gold md:w-32" />
            <p className="mb-5 font-display text-lg uppercase tracking-[0.22em] text-foreground/90 sm:text-xl md:mb-6 md:text-2xl md:tracking-[0.3em]">
              Revelando Campeões
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-base font-light leading-relaxed text-foreground/78 sm:text-lg md:mb-10">
              A plataforma oficial para cadastro, avaliações e acompanhamento de touros de rodeio. Conectando tropeiros, eventos e paixão.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <Link
              to="/touros"
              className="rounded border border-gold bg-background/35 px-7 py-3 font-display text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10 md:px-8"
            >
              Explorar Touros
            </Link>
            <Link
              to="/eventos"
              className="rounded border border-gold bg-background/35 px-7 py-3 font-display text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10 md:px-8"
            >
              Ver Eventos
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
