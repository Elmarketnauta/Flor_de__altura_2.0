"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { RITUAL_COUPON } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Caja de cupón destacada con microinteracción de copiar al portapapeles.
 * Copia "RITUAL20" con un clic y muestra confirmación temporal.
 */
export function CouponBox() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(RITUAL_COUPON);
    } catch {
      // Fallback para navegadores sin Clipboard API.
      const el = document.createElement("textarea");
      el.value = RITUAL_COUPON;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }

    setCopied(true);
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "copy_coupon",
        coupon_code: RITUAL_COUPON,
      });
    }
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-gold bg-gold/10 p-5 sm:flex-row">
      <div>
        <h4 className="font-serif text-lg text-espresso-800">
          20% de Descuento en la Web
        </h4>
        <p className="mt-1 text-sm text-espresso-500">
          Al comprar el curso, obtén un código vitalicio para tus compras de
          café en Flor de Altura.
        </p>
      </div>

      <button
        onClick={handleCopy}
        aria-label={`Copiar el cupón ${RITUAL_COUPON}`}
        data-layer="copy_coupon"
        data-coupon={RITUAL_COUPON}
        className={cn(
          "group flex shrink-0 items-center gap-2 rounded-xl border-2 border-dashed px-5 py-3 font-mono text-lg font-bold tracking-widest transition",
          copied
            ? "border-organic bg-organic text-cream"
            : "border-gold-dark bg-cream text-espresso-800 hover:bg-white",
        )}
      >
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            <span className="text-base">¡Copiado!</span>
          </>
        ) : (
          <>
            {RITUAL_COUPON}
            <Copy className="h-4 w-4 text-gold-dark transition group-hover:scale-110" />
          </>
        )}
      </button>
    </div>
  );
}
