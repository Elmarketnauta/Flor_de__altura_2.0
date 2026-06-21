import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { CartDrawer } from "@/components/cart/CartDrawer";

const OrigenSection = dynamic(
  () => import("@/components/layout/OrigenSection").then((m) => m.OrigenSection),
  { loading: () => <div className="h-96" /> }
);

const CatalogSection = dynamic(
  () => import("@/components/catalog/CatalogSection").then((m) => m.CatalogSection),
  { loading: () => <div className="h-96" /> }
);

const B2BSection = dynamic(
  () => import("@/components/b2b/B2BSection").then((m) => m.B2BSection),
  { loading: () => <div className="h-96" /> }
);

const RevistaSection = dynamic(
  () => import("@/components/revista/RevistaSection").then((m) => m.RevistaSection),
  { loading: () => <div className="h-96" /> }
);

const EducationSection = dynamic(
  () => import("@/components/education/EducationSection").then((m) => m.EducationSection),
  { loading: () => <div className="h-96" /> }
);

const Testimonials = dynamic(
  () => import("@/components/layout/Testimonials").then((m) => m.Testimonials),
  { loading: () => <div className="h-96" /> }
);

const Footer = dynamic(
  () => import("@/components/layout/Footer").then((m) => m.Footer),
  { loading: () => <div className="h-20" /> }
);

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
