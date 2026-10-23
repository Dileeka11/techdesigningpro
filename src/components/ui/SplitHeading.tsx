import type { CSSProperties, ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Words (exact match, punctuation included) rendered in animated gold. */
  gold?: string[];
  /** Animate on page load with CSS (for above-the-fold headings). */
  auto?: boolean;
  delay?: number;
  id?: string;
};

/** Heading whose words slide up one after another. Text stays one string for SEO. */
export function SplitHeading({ text, as: Tag = "h2", className = "", gold = [], auto, delay = 0, id }: Props) {
  const words = text.split(" ");
  return (
    <Tag
      id={id}
      aria-label={text}
      className={`${auto ? "split-auto" : "split-heading"} ${className}`}
      style={{ "--split-delay": `${delay}ms` } as CSSProperties}
    >
      {words.map((w, i) => (
        <span key={i} aria-hidden className="split-word">
          <span style={{ "--i": i } as CSSProperties} className={gold.includes(w) ? "text-gold-animated pr-[0.04em]" : undefined}>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
