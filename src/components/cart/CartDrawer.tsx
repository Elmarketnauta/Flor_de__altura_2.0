"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { formatPEN } from "@/lib/utils";
import { ConfettiCanvas } from "./ConfettiCanvas";
import { trackEvent } from "@/lib/analytics";

/**
 * Panel lateral global del carrito (slide-out) con cinematografía mejorada.
 * Backdrop blur masivo (20px) + grayscale (40%) cuando está abierto.
 * Confetti en checkout exitoso.
 */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const incrementItem = useCartStore((s) => s.incrementItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const buildWhatsAppUrl = useCartStore((s) => s.buildWhatsAppUrl);
  const canCheckout = useCartStore((s) => s.canCheckout);

  const [showConfetti, setShowConfetti] = useState(false);

  // Body scroll lock + cierre con tecla Escape.
  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("scroll-locked");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const isEmpty = items.length === 0;

  const handleCheckout = () => {
    if (!canCheckout()) {
      alert("Mínimo de pedido: S/ 100");
      return;
    }

    trackEvent("begin_checkout", {
      itemsCount: items.length,
      total: totalPrice(),
    });

    // Trigger confetti
    setShowConfetti(true);

    // Abrir WhatsApp después de 1 segundo
    setTimeout(() => {
      const url = buildWhatsAppUrl();
      window.open(url, "_blank", "noopener,noreferrer");
      closeCart();
    }, 1000);
  };

  return (
    <>
      <ConfettiCanvas trigger={showConfetti} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-hidden={!isOpen}
          >
            {/* Overlay con blur masivo + grayscale */}
            <motion.div
              className="absolute inset-0 bg-espresso-900/50 backdrop-blur-[20px]"
              style={{
                WebkitBackdropFilter: "blur(20px) grayscale(0.4)",
              }}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.25 }}
              onClick={closeCart}
            />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-drawer"
            variants={{
              hidden: { x: "100%" },
              visible: { x: 0 },
            }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <header className="flex items-center justify-between border-b border-sand px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold-dark" />
                <h2 className="font-serif text-lg text-espresso-800">
                  Tu pedido
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Cerrar carrito"
                className="rounded-full p-2 text-espresso-500 transition hover:bg-sand"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {isEmpty ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-espresso-400">
                  <ShoppingBag className="mb-4 h-12 w-12" strokeWidth={1.2} />
                  <p className="font-medium text-espresso-600">
                    Tu carrito está vacío
                  </p>
                  <p className="mt-1 text-sm">
                    Descubre nuestros microlotes de altura.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 rounded-xl bg-white/60 p-3 shadow-sm"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-sand">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-espresso-800">
                              {item.name}
                            </p>
                            <p className="text-xs uppercase tracking-wide text-espresso-400">
                              {item.format === "grano" ? "En grano" : "Molido"}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Quitar ${item.name}`}
                            data-layer="cart_remove_item"
                            data-product-id={item.productId}
                            className="rounded p-1 text-espresso-300 transition hover:text-clay"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          {/* Stepper */}
                          <div className="flex items-center gap-1 rounded-full border border-sand bg-cream">
                            <button
                              onClick={() => decrementItem(item.id)}
                              aria-label="Disminuir cantidad"
                              className="rounded-full p-1.5 text-espresso-600 transition hover:bg-sand"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementItem(item.id)}
                              aria-label="Aumentar cantidad"
                              className="rounded-full p-1.5 text-espresso-600 transition hover:bg-sand"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="font-semibold text-espresso-800 tabular-nums">
                            {formatPEN(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer / Checkout */}
            {!isEmpty && (
              <motion.footer
                className="border-t border-sand bg-white/70 px-5 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-espresso-500">Total</span>
                  <motion.span
                    className="font-serif text-xl font-semibold text-espresso-800 tabular-nums"
                    key={totalPrice()}
                  >
                    {formatPEN(totalPrice())}
                  </motion.span>
                </div>

                {!canCheckout() && (
                  <motion.div
                    className="mb-3 rounded-lg bg-clay/10 px-3 py-2 text-xs text-clay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Mínimo de pedido: S/ 100 · Actual: {formatPEN(totalPrice())}
                  </motion.div>
                )}

                <motion.button
                  id="whatsapp-checkout"
                  onClick={handleCheckout}
                  disabled={!canCheckout()}
                  data-layer="begin_checkout_whatsapp"
                  data-cart-value={totalPrice().toFixed(2)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-organic px-6 py-3.5 font-medium text-white shadow-card transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-organic-dark active:scale-[0.99]"
                  whileHover={canCheckout() ? { scale: 1.02 } : {}}
                  whileTap={canCheckout() ? { scale: 0.98 } : {}}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Finalizar pedido por WhatsApp
                </motion.button>
                <p className="mt-2 text-center text-xs text-espresso-400">
                  Coordinamos pago y entrega por chat. Sin fricciones.
                </p>
              </motion.footer>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.515 5.26l-.999 3.648 3.973-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" />
    </svg>
  );
}
