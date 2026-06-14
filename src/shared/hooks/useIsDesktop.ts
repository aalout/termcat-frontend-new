"use client";

import { useMediaQuery } from "./useMediaQuery";

export const DESKTOP_MEDIA = "(min-width: 768px)";

/** True when viewport matches desktop breakpoint (viewport ≥ 768px). */
export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_MEDIA);
}
