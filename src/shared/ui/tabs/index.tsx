"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";
import type { NormalizedItem, TabItem, TabsProps } from "./model/types";

const normalizeItems = (items: TabItem[]): NormalizedItem[] =>
  items.map((item, idx) => {
    if (typeof item === "string") {
      return { label: item, value: item, disabled: false, id: `tab-${idx}` };
    }
    return {
      label: item.label,
      value: item.value,
      disabled: Boolean(item.disabled),
      id: item.id ?? `tab-${idx}`,
    };
  });

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  ariaLabel,
  className,
  variant = "default",
}: TabsProps) {
  const normalized = useMemo(() => normalizeItems(items), [items]);

  const initialIndex = useMemo(() => {
    if (value !== undefined) {
      const idx = normalized.findIndex((i) => i.value === value);
      return idx >= 0 ? idx : 0;
    }
    if (defaultValue !== undefined) {
      const idx = normalized.findIndex((i) => i.value === defaultValue);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [normalized, value, defaultValue]);

  const isControlled = value !== undefined;
  const [uncontrolledIndex, setUncontrolledIndex] =
    useState<number>(initialIndex);

  const selectedIndex = useMemo(() => {
    if (isControlled) {
      const idx = normalized.findIndex((i) => i.value === value);
      return idx >= 0 ? idx : 0;
    }
    return uncontrolledIndex;
  }, [isControlled, normalized, uncontrolledIndex, value]);

  const handleSelect = useCallback(
    (idx: number) => {
      const item = normalized[idx];
      if (!item || item.disabled) return;
      if (!isControlled) {
        setUncontrolledIndex(idx);
      }
      onChange?.(item.value, idx);
    },
    [isControlled, normalized, onChange]
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [bgX, setBgX] = useState<number>(0);
  const [bgW, setBgW] = useState<number>(0);

  const updateBackground = useCallback(() => {
    const activeEl = tabRefs.current[selectedIndex];
    const containerEl = containerRef.current;
    if (!activeEl || !containerEl) return;

    requestAnimationFrame(() => {
      const { offsetLeft, offsetWidth } = activeEl;
      const inset = 0;
      setBgX(offsetLeft + inset);
      setBgW(Math.max(0, offsetWidth - inset * 2));
    });
  }, [selectedIndex]);

  const hasAnimatedIndicator = variant !== "buttons";

  useEffect(() => {
    if (hasAnimatedIndicator) {
      updateBackground();
    }
  }, [normalized, selectedIndex, updateBackground, hasAnimatedIndicator]);

  useEffect(() => {
    if (!hasAnimatedIndicator) return;
    const handleResize = () => {
      updateBackground();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateBackground, hasAnimatedIndicator]);

  useEffect(() => {
    if (!hasAnimatedIndicator) return;
    const activeEl = tabRefs.current[selectedIndex];
    const containerEl = containerRef.current;
    if (!activeEl || !containerEl) return;

    const resizeObserver = new ResizeObserver(() => {
      updateBackground();
    });

    resizeObserver.observe(activeEl);
    resizeObserver.observe(containerEl);

    tabRefs.current.forEach((tab) => {
      if (tab) resizeObserver.observe(tab);
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedIndex, updateBackground, hasAnimatedIndicator, normalized]);

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      ref={containerRef}
      className={cn(
        styles.container,
        variant === "buttons" && styles.buttons,
        variant === "section" && styles.section,
        className
      )}
    >
      {hasAnimatedIndicator && (
        <div
          className={styles.background}
          style={{ transform: `translateX(${bgX}px)`, width: bgW }}
          aria-hidden="true"
        />
      )}
      {normalized.map((item, idx) => {
        const isActive = idx === selectedIndex;
        const isDisabled = item.disabled;
        return (
          <button
            key={item.id ?? `${item.value}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            tabIndex={isActive ? 0 : -1}
            className={cn(
              styles.tab,
              variant === "buttons" && styles.tabButtons,
              variant === "section" && styles.tabSection,
              isActive && styles.tabActive,
              variant === "buttons" && isActive && styles.tabButtonsActive,
              variant === "section" && isActive && styles.tabSectionActive,
              isDisabled && styles.tabDisabled
            )}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            onClick={() => handleSelect(idx)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
