"use client";

import { useEffect } from "react";

/**
 * Locks body scroll while `locked` is true (e.g. modals).
 */
export function useScrollBlock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return;

    const { body } = document;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = prev;
    };
  }, [locked]);
}
