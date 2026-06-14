import type { SVGProps } from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

export type IconSize = 16 | 18 | 20 | 24;

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: IconSize;
}

export function Icon({
  size = 16,
  className,
  viewBox,
  children,
  ...props
}: IconProps) {
  return (
    <svg
      className={cn(styles.icon, styles[`s${size}`], className)}
      viewBox={viewBox ?? `0 0 ${size} ${size}`}
      fill="none"
      data-icon=""
      aria-hidden={props["aria-hidden"] ?? true}
      {...props}
    >
      {children}
    </svg>
  );
}
