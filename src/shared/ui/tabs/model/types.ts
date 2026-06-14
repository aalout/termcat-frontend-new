import type { ReactNode } from "react";

export type Primitive = string | number | boolean;

export type TabItem =
  | string
  | {
      label: string | ReactNode;
      value: Primitive;
      disabled?: boolean;
      id?: string;
    };

export type TabsProps = {
  items: TabItem[];
  value?: Primitive;
  defaultValue?: Primitive;
  onChange?: (value: Primitive, index: number) => void;
  ariaLabel?: string;
  className?: string;
  variant?: "default" | "buttons" | "section";
};

export type NormalizedItem = {
  label: string | ReactNode;
  value: Primitive;
  disabled: boolean;
  id?: string;
};
