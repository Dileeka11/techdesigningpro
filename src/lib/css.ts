import type { CSSProperties } from "react";

/** Typed helper for inline CSS custom properties, e.g. vars({ "--d": "200ms" }). */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties;
