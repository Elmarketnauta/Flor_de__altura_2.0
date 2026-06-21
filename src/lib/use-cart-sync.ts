"use client";

import { useEffect, useRef, useCallback } from "react";
import { useCartStore } from "@/store/cart-store";

const SYNC_INTERVAL = 30000; // 30 segundos
const SYNC_DEBOUNCE = 5000; // 5 segundos

export function useCartSync() {
  const { syncWithRemote, items } = useCartStore();
  const lastSyncRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const performSync = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (items.length === 0) return;

    // Evitar race conditions con AbortController
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      await syncWithRemote();
      lastSyncRef.current = Date.now();
    } catch (error) {
      console.error("[useCartSync] Sync error:", error);
    }
  }, [items.length, syncWithRemote]);

  // Sync en intervalos cuando el carrito tiene items
  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      const timeSinceLastSync = Date.now() - lastSyncRef.current;
      if (timeSinceLastSync > SYNC_INTERVAL) {
        performSync();
      }
    }, SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [items.length, performSync]);

  // Sync con debounce cuando items cambian
  useEffect(() => {
    if (items.length === 0) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSync();
    }, SYNC_DEBOUNCE);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [items, performSync]);

  // Cleanup
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { performSync };
}
