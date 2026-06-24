"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const NO_SHELL_PREFIXES = ["/admin", "/auth"];
// Rutas donde el primer bloque de contenido cubre el header (hero a pantalla completa)
const FULL_BLEED_ROUTES = ["/"];

interface SiteShellProps {
  children: React.ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const hideShell = NO_SHELL_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (hideShell) {
    return <>{children}</>;
  }

  const isFullBleed = FULL_BLEED_ROUTES.includes(pathname);

  return (
    <>
      <Header />
      {/* En rutas con hero a pantalla completa el propio hero cubre el header fijo.
          En páginas internas añadimos el padding para no quedar detrás del header. */}
      <div className={isFullBleed ? undefined : "pt-16"}>
        {children}
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}
