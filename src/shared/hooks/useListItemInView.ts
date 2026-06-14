"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type UseListItemInViewOptions = {
  threshold?: number | number[];
  rootMargin?: string;
  /**
   * When true, only marks visible when intersecting while scrolling down the scroll root.
   * When false, any intersection counts.
   */
  onlyAnimateOnScrollDown?: boolean;
};

export function useListItemInView(
  elementRef: RefObject<Element | null>,
  scrollRootRef: RefObject<Element | null>,
  {
    threshold = 0.1,
    rootMargin = "0px",
    onlyAnimateOnScrollDown = true,
  }: UseListItemInViewOptions = {}
): { inView: boolean; suppressTransition: boolean } {
  const [inView, setInView] = useState(false);
  const [suppressTransition, setSuppressTransition] = useState(true);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const root = scrollRootRef.current;

    const readScrollTop = () => {
      if (root && "scrollTop" in root)
        return (root as HTMLElement).scrollTop;
      return typeof window !== "undefined" ? window.scrollY : 0;
    };

    lastScrollTopRef.current = readScrollTop();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) {
          setInView(false);
          return;
        }

        if (!onlyAnimateOnScrollDown) {
          setInView(true);
          return;
        }

        const now = readScrollTop();
        const goingDown = now >= lastScrollTopRef.current;
        lastScrollTopRef.current = now;
        if (goingDown) setInView(true);
      },
      { threshold, rootMargin, root: root ?? undefined }
    );

    observer.observe(el);

    const id = requestAnimationFrame(() => setSuppressTransition(false));

    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, [
    elementRef,
    scrollRootRef,
    threshold,
    rootMargin,
    onlyAnimateOnScrollDown,
  ]);

  return { inView, suppressTransition };
}
