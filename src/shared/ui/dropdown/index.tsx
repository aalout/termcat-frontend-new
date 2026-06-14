"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  align?: "left" | "right";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dropdown({
  trigger,
  children,
  className,
  contentClassName,
  align = "right",
  open: openProp,
  onOpenChange,
}: DropdownProps) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value;
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange, open, openProp]
  );
  const [pos, setPos] = useState<React.CSSProperties | undefined>();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (open) {
      setPos(getPosition(rootRef.current, align));
    }
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      close();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [close, open]);

  return (
    <div ref={rootRef} className={cn(styles.root, className)}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {trigger}
      </button>
      {open &&
        createPortal(
          <div
            ref={contentRef}
            className={cn(
              styles.content,
              align === "right" ? styles.alignRight : styles.alignLeft,
              contentClassName
            )}
            style={pos}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
}

function getPosition(
  anchor: HTMLDivElement | null,
  align: "left" | "right"
): React.CSSProperties | undefined {
  if (!anchor) return undefined;
  const rect = anchor.getBoundingClientRect();
  return {
    top: rect.bottom + 8,
    ...(align === "right"
      ? { right: window.innerWidth - rect.right }
      : { left: rect.left }),
  };
}
