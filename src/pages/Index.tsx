import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import {
  FeaturedBulls,
  FeaturedTropeiros,
  UpcomingEvents,
  AboutSection,
} from "@/components/HomeSections";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedBulls />
        <FeaturedTropeiros />
        <UpcomingEvents />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
