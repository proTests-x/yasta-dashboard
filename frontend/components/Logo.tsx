
import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  inverted?: boolean;
};

export function Logo({ compact = false, inverted = false }: LogoProps) {
  return (
    <Link className={`brand ${inverted ? "brand--inverted" : ""}`} href="/" aria-label="yasta, inicio">
      <span className="brand__mark">
        <span aria-hidden="true" style={{ color: "#00498c" }}>Y</span>
      </span>
      {!compact && <span className="brand__name">yasta</span>}
    </Link>
  );
}
