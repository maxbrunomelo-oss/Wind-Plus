/**
 * WindPlusWordmark
 *
 * Two variants:
 *   inline  — "Wind PLUS" side by side (default)
 *   stacked — logo icon on top, "Wind" below, "PLUS" below that (like brand identity image)
 *
 * Typography:
 *   "Wind" → Montserrat Black (900)  — equivalent to Gotham Black
 *   "PLUS" → Montserrat Medium (500) — high letter-spacing
 */

interface Props {
  variant?: "inline" | "stacked";
  /** Size class for "Wind" in stacked mode, e.g. "text-3xl" */
  windSize?: string;
  /** Size class for "PLUS" in stacked mode */
  plusSize?: string;
  /** Size class used in inline mode */
  size?: string;
  windColor?: string;
  plusColor?: string;
  className?: string;
}

export default function WindPlusWordmark({
  variant = "inline",
  windSize = "text-4xl",
  plusSize = "text-xs",
  size = "text-base",
  windColor = "text-[#111111]",
  plusColor = "text-[#E30613]",
  className = "",
}: Props) {
  if (variant === "stacked") {
    return (
      <div
        className={`flex flex-col items-center font-[family-name:var(--font-montserrat)] ${className}`}
      >
        <span className={`font-black leading-none tracking-tight ${windSize} ${windColor}`}>
          Wind
        </span>
        <span
          className={`font-medium uppercase ${plusSize} ${plusColor}`}
          style={{ letterSpacing: "0.35em" }}
        >
          Plus
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-baseline gap-[0.15em] font-[family-name:var(--font-montserrat)] ${size} ${className}`}
    >
      <span className={`font-black leading-none ${windColor}`}>Wind</span>
      <span
        className={`font-medium uppercase ${plusColor}`}
        style={{ letterSpacing: "0.28em" }}
      >
        Plus
      </span>
    </span>
  );
}
