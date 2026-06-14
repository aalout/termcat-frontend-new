"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { useScrollBlock } from "@/shared/hooks/useScrollBlock";
import { ModalCloseGlyph } from "./modal-close-icon";
import { PortalContainerContext } from "./portal-context";
import styles from "./index.module.css";

type ModalProps = {
  opened: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "empty";
  closable?: boolean;
  /** `aria-label` for the close button; default "Close". */
  closeLabel?: string;
};

export function Modal({
  opened,
  onClose,
  className,
  children,
  variant = "default",
  closable = true,
  closeLabel = "Close",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const mouseDownRef = useRef<HTMLElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    if (dialogRef.current) {
      setPortalContainer(dialogRef.current);
    }
  }, []);

  useScrollBlock(opened);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (opened) dialog.showModal();
    else dialog.close();
  }, [opened]);

  useEffect(() => {
    if (!opened || !closable) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (shellRef.current && e.target === shellRef.current) {
        mouseDownRef.current = shellRef.current;
      } else {
        mouseDownRef.current = null;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (
        mouseDownRef.current &&
        shellRef.current &&
        e.target === shellRef.current &&
        e.target === mouseDownRef.current
      ) {
        onClose();
      }
      mouseDownRef.current = null;
    };

    const shell = shellRef.current;
    shell?.addEventListener("mousedown", handleMouseDown);
    shell?.addEventListener("mouseup", handleMouseUp);

    return () => {
      shell?.removeEventListener("mousedown", handleMouseDown);
      shell?.removeEventListener("mouseup", handleMouseUp);
    };
  }, [opened, onClose, closable]);

  const handleClose = () => {
    if (!closable) return;
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!closable) return;
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      handleClose();
    }
  };

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
    e.preventDefault();
    if (!closable) return;
    handleClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(styles.dialog, className)}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
    >
      <div ref={shellRef} className={styles.shell}>
        <PortalContainerContext.Provider value={portalContainer}>
          {variant === "default" && (
            <div
              className={styles.content}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
            >
              {closable && (
                <button
                  type="button"
                  className={styles.close}
                  onClick={handleClose}
                  aria-label={closeLabel}
                  tabIndex={0}
                >
                  <ModalCloseGlyph />
                </button>
              )}
              {children}
            </div>
          )}
          {variant === "empty" && children}
        </PortalContainerContext.Provider>
      </div>
    </dialog>
  );
}
