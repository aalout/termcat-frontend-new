"use client";

import Link from "next/link";
import {
  ButtonHTMLAttributes,
  forwardRef,
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { cn } from "@/shared/lib/cn";
import styles from "./index.module.css";

type LinkPassThrough = Pick<
  ComponentProps<typeof Link>,
  "prefetch" | "replace" | "scroll" | "target"
>;

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    LinkPassThrough {
  variant?: "primary" | "secondary" | "outline" | "icon" | "gradient" | "soon";
  size?: "large" | "medium" | "small";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Shown when `variant === "icon"` if `iconSrc` is not set. */
  iconChild?: ReactNode;
  /** Primary visual for `variant === "icon"`. */
  iconSrc?: ReactNode;
  isLink?: boolean;
  href?: ComponentProps<typeof Link>["href"];
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "medium",
      rightIcon,
      leftIcon,
      iconChild,
      iconSrc,
      children,
      disabled = false,
      type = "button",
      isLink = false,
      href,
      prefetch,
      replace,
      scroll,
      target,
      onClick,
      ...passthrough
    },
    ref
  ) => {
    const isIconType = variant === "icon";

    const classNames = cn(
      styles.button,
      styles[variant],
      !isIconType && styles[size],
      variant === "soon" && styles.soon,
      className
    );

    const renderIconSlot = (icon: ReactNode, key: string) => (
      <span className={styles.image} key={key}>
        {icon}
      </span>
    );

    const content = (
      <>
        {isIconType && (iconSrc ?? iconChild) && (
          <span className={styles.image}>{iconSrc ?? iconChild}</span>
        )}
        {!isIconType && leftIcon && renderIconSlot(leftIcon, "left")}
        {!isIconType && children != null && <span>{children}</span>}
        {!isIconType && rightIcon && renderIconSlot(rightIcon, "right")}
      </>
    );

    const handleDisabledClick: MouseEventHandler<HTMLAnchorElement> = (
      event
    ) => {
      event.preventDefault();
    };

    if (isLink && href != null) {
      return (
        <Link
          href={href}
          className={classNames}
          prefetch={prefetch}
          replace={replace}
          scroll={scroll}
          target={target}
          aria-disabled={disabled || undefined}
          data-disabled={disabled || undefined}
          onClick={
            disabled
              ? handleDisabledClick
              : (onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>)
          }
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={classNames}
        type={type}
        disabled={disabled}
        onClick={onClick}
        {...passthrough}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
