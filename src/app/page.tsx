import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { OrigenSection } from "@/components/layout/OrigenSection";
import { Testimonials } from "@/components/layout/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { B2BSection } from "@/components/b2b/B2BSection";
import { RevistaSection } from "@/components/revista/RevistaSection";
import { EducationSection } from "@/components/education/EducationSection";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <OrigenSection />
        <CatalogSection />
        <B2BSection />
        <RevistaSection />
        <EducationSection />
        <Testimonials />
      </main>
      <Footer />

      {/* Carrito global: vive fuera del flujo, disponible en toda la app */}
      <CartDrawer />
    </>
  );
}
