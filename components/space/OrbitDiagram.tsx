"use client";

type Props = {
  className?: string;
};

export function OrbitDiagram({ className = "" }: Props) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg viewBox="0 0 640 480" className="h-full w-full" role="presentation">
        <defs>
          <linearGradient id="orbitStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#65D9FF" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#8B7CFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#65D9FF" stopOpacity="0.2" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* orbital ellipses */}
        <ellipse
          cx="330"
          cy="240"
          rx="250"
          ry="140"
          fill="none"
          stroke="url(#orbitStroke)"
          strokeWidth="1"
          className="motion-safe:animate-orbit-pulse"
        />
        <ellipse
          cx="330"
          cy="240"
          rx="180"
          ry="95"
          fill="none"
          stroke="rgba(130,190,255,0.22)"
          strokeWidth="0.8"
          strokeDasharray="3 6"
        />
        <ellipse
          cx="330"
          cy="240"
          rx="110"
          ry="55"
          fill="none"
          stroke="rgba(139,124,255,0.28)"
          strokeWidth="0.8"
        />

        {/* connection path thought -> structure -> product */}
        <path
          d="M120 300 C180 220, 240 180, 330 200 C400 215, 460 250, 520 180"
          fill="none"
          stroke="rgba(101,217,255,0.35)"
          strokeWidth="1"
          filter="url(#softGlow)"
        />

        {/* traveling light on path */}
        <circle r="2.5" fill="#65D9FF" filter="url(#softGlow)">
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            path="M120 300 C180 220, 240 180, 330 200 C400 215, 460 250, 520 180"
          />
        </circle>

        {/* Thought node */}
        <g transform="translate(110, 290)">
          <circle r="18" fill="rgba(10,18,35,0.8)" stroke="rgba(101,217,255,0.45)" strokeWidth="1" />
          <circle r="4" fill="#65D9FF" opacity="0.85" />
          <text x="28" y="4" fill="#8E9BB2" fontSize="11" fontFamily="ui-monospace, monospace">
            THOUGHT
          </text>
        </g>

        {/* Structure node */}
        <g transform="translate(318, 188)">
          <circle r="14" fill="rgba(10,18,35,0.75)" stroke="rgba(139,124,255,0.5)" strokeWidth="1" />
          <circle r="3.5" fill="#8B7CFF" opacity="0.9" />
          <text x="22" y="4" fill="#8E9BB2" fontSize="11" fontFamily="ui-monospace, monospace">
            STRUCTURE
          </text>
        </g>

        {/* Product node */}
        <g transform="translate(510, 168)">
          <rect
            x="-22"
            y="-22"
            width="44"
            height="44"
            rx="2"
            fill="rgba(10,18,35,0.85)"
            stroke="rgba(101,217,255,0.55)"
            strokeWidth="1"
            filter="url(#softGlow)"
          />
          <circle r="3.5" fill="#65D9FF" />
          <text x="30" y="4" fill="#F3F6FF" fontSize="12" fontFamily="ui-monospace, monospace">
            PRODUCT
          </text>
        </g>

        {/* faint coordinate ticks */}
        <g stroke="rgba(130,190,255,0.2)" strokeWidth="0.6">
          <line x1="40" y1="40" x2="80" y2="40" />
          <line x1="40" y1="40" x2="40" y2="80" />
          <line x1="560" y1="400" x2="600" y2="400" />
          <line x1="600" y1="360" x2="600" y2="400" />
        </g>
        <text x="48" y="34" fill="rgba(142,155,178,0.7)" fontSize="9" fontFamily="ui-monospace, monospace">
          OBS-01
        </text>
      </svg>
    </div>
  );
}
