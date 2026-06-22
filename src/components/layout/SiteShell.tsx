"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const NO_SHELL_PREFIXES = ["/admin", "/auth"];

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

  return (
    <>
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}
