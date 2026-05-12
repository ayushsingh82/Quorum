import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number;
};

export default function QuorumLogo({ size = 36, className = "", ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <defs>
        <radialGradient id="qg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill="url(#qg-glow)" />
      <circle
        cx="50"
        cy="50"
        r="36"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.95"
      />
      <g stroke="currentColor" strokeWidth="1.1" opacity="0.45">
        <line x1="50" y1="50" x2="50" y2="22" />
        <line x1="50" y1="50" x2="74" y2="40" />
        <line x1="50" y1="50" x2="66" y2="72" />
        <line x1="50" y1="50" x2="34" y2="72" />
        <line x1="50" y1="50" x2="26" y2="40" />
      </g>
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.22">
        <line x1="50" y1="22" x2="74" y2="40" />
        <line x1="74" y1="40" x2="66" y2="72" />
        <line x1="66" y1="72" x2="34" y2="72" />
        <line x1="34" y1="72" x2="26" y2="40" />
        <line x1="26" y1="40" x2="50" y2="22" />
      </g>
      <g fill="currentColor">
        <circle cx="50" cy="22" r="3.6" />
        <circle cx="74" cy="40" r="3.6" />
        <circle cx="66" cy="72" r="3.6" />
        <circle cx="34" cy="72" r="3.6" />
        <circle cx="26" cy="40" r="3.6" />
      </g>
      <circle cx="50" cy="50" r="5.2" fill="currentColor" />
      <circle cx="50" cy="50" r="8.8" stroke="currentColor" strokeWidth="0.9" opacity="0.55" />
      <line
        x1="73"
        y1="73"
        x2="92"
        y2="92"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function QuorumWordmark({
  size = 32,
  showText = true,
  className = "",
}: {
  size?: number;
  showText?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <QuorumLogo size={size} className="text-emerald-300" />
      {showText && (
        <span className="font-mono text-sm font-semibold tracking-[0.32em] text-emerald-300">
          QUORUM
        </span>
      )}
    </span>
  );
}
