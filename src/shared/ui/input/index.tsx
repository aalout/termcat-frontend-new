"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional control shown before input text */
  leadingSlot?: ReactNode;
  trailingSlot?: ReactNode;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leadingSlot,
      trailingSlot,
      className = "",
      error,
      errorMessage,
      fullWidth,
      ...props
    },
    ref
  ) => {
    const hasLeading = Boolean(leadingSlot);
    const hasTrailing = Boolean(trailingSlot);
    const inputClassName = cn(
      className,
      (hasLeading || hasTrailing) && styles.inputWithAddons,
      error && styles.inputError
    );

    return (
      <div className={cn(styles.root, fullWidth && styles.rootFullWidth)}>
        {hasLeading && (
          <div className={styles.leadingSlot}>{leadingSlot}</div>
        )}
        <input
          ref={ref}
          className={inputClassName}
          aria-invalid={error || undefined}
          {...props}
        />
        {hasTrailing && (
          <div className={styles.trailingSlot} data-trailing-slot>
            {trailingSlot}
          </div>
        )}
        {error && errorMessage ? (
          <span className={styles.errorMessage} role="alert">
            {errorMessage}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
