"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, fullWidth, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          styles.textarea,
          fullWidth && styles.fullWidth,
          error && styles.error,
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
