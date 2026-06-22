import dynamic from "next/dynamic";
import { Hero } from "@/components/layout/Hero";
import { RecommendationsCarousel } from "@/components/recommendations/RecommendationsCarousel";

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

export default function HomePage() {
  return (
    <main>
      <Hero />
      <OrigenSection />
      <CatalogSection />
      <div className="bg-white border-t border-sand">
        <div className="container-app">
          <RecommendationsCarousel
            strategy="trending"
            limit={4}
            title="Destacados para ti"
          />
        </div>
      </div>
      <B2BSection />
      <RevistaSection />
      <EducationSection />
      <Testimonials />
    </main>
  );
}
