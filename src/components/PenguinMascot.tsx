"use client";

interface PenguinMascotProps {
  variant?: "hero" | "small" | "peek";
  size?: number;
  className?: string;
}

function HeroPenguin({ size }: { size: number }) {
  const w = size;
  const h = size * 1.2;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 260 312"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Balloon string */}
      <path
        d="M155 60 Q160 90 150 120"
        stroke="#ffb0ab"
        strokeWidth="2"
        fill="none"
      />
      {/* Balloon */}
      <ellipse cx="150" cy="40" rx="28" ry="32" fill="#ff787e" opacity="0.85" />
      <ellipse cx="143" cy="32" rx="8" ry="10" fill="#ffb0ab" opacity="0.5" />
      {/* Balloon knot */}
      <polygon points="148,70 152,70 150,76" fill="#ff787e" opacity="0.85" />

      {/* Background clouds */}
      <ellipse cx="40" cy="220" rx="50" ry="25" fill="#ffb0ab" opacity="0.15" />
      <ellipse cx="70" cy="200" rx="40" ry="22" fill="#ffb0ab" opacity="0.12" />
      <ellipse cx="220" cy="260" rx="45" ry="20" fill="#ddf5ff" opacity="0.3" />

      {/* Hearts */}
      <g transform="translate(30,160) scale(0.5)">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#ff787e"
          opacity="0.6"
        />
      </g>
      <g transform="translate(55,130) scale(0.35)">
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="#ffb0ab"
          opacity="0.5"
        />
      </g>

      {/* Star */}
      <g transform="translate(195,100) scale(0.7)">
        <polygon
          points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"
          fill="#fdb95c"
          opacity="0.8"
        />
      </g>

      {/* Body (tilted playfully) */}
      <g transform="translate(130,190) rotate(-15)">
        {/* Shadow */}
        <ellipse cx="0" cy="85" rx="65" ry="15" fill="#000" opacity="0.04" />
        {/* Main body */}
        <ellipse cx="0" cy="0" rx="68" ry="78" fill="#73d9ff" />
        {/* Belly */}
        <ellipse cx="0" cy="10" rx="48" ry="58" fill="white" />
        {/* Left wing */}
        <ellipse
          cx="-58"
          cy="-10"
          rx="22"
          ry="40"
          fill="#5cc8ee"
          transform="rotate(25 -58 -10)"
        />
        {/* Right wing (raised, holding balloon) */}
        <ellipse
          cx="50"
          cy="-40"
          rx="20"
          ry="38"
          fill="#5cc8ee"
          transform="rotate(-40 50 -40)"
        />
        {/* Feet */}
        <ellipse cx="-25" cy="75" rx="18" ry="8" fill="#fdb95c" />
        <ellipse cx="25" cy="75" rx="18" ry="8" fill="#fdb95c" />

        {/* Face */}
        {/* Left eye */}
        <ellipse cx="-18" cy="-25" rx="14" ry="15" fill="#1a1a2e" />
        <ellipse cx="-22" cy="-30" rx="5" ry="6" fill="white" />
        <circle cx="-14" cy="-22" r="2.5" fill="white" />
        {/* Right eye */}
        <ellipse cx="18" cy="-25" rx="14" ry="15" fill="#1a1a2e" />
        <ellipse cx="14" cy="-30" rx="5" ry="6" fill="white" />
        <circle cx="22" cy="-22" r="2.5" fill="white" />
        {/* Beak */}
        <ellipse cx="0" cy="-5" rx="10" ry="6" fill="#fdb95c" />
        {/* Cheeks */}
        <ellipse cx="-32" cy="-8" rx="10" ry="7" fill="#ffb0ab" opacity="0.4" />
        <ellipse cx="32" cy="-8" rx="10" ry="7" fill="#ffb0ab" opacity="0.4" />
      </g>
    </svg>
  );
}

function SmallPenguin({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(40,42)">
        {/* Body */}
        <ellipse cx="0" cy="0" rx="26" ry="30" fill="#73d9ff" />
        {/* Belly */}
        <ellipse cx="0" cy="4" rx="18" ry="22" fill="white" />
        {/* Wings */}
        <ellipse
          cx="-22"
          cy="-2"
          rx="8"
          ry="16"
          fill="#5cc8ee"
          transform="rotate(15 -22 -2)"
        />
        <ellipse
          cx="22"
          cy="-2"
          rx="8"
          ry="16"
          fill="#5cc8ee"
          transform="rotate(-15 22 -2)"
        />
        {/* Feet */}
        <ellipse cx="-10" cy="28" rx="8" ry="4" fill="#fdb95c" />
        <ellipse cx="10" cy="28" rx="8" ry="4" fill="#fdb95c" />
        {/* Eyes */}
        <ellipse cx="-8" cy="-10" rx="5.5" ry="6" fill="#1a1a2e" />
        <ellipse cx="-10" cy="-12" rx="2" ry="2.5" fill="white" />
        <ellipse cx="8" cy="-10" rx="5.5" ry="6" fill="#1a1a2e" />
        <ellipse cx="6" cy="-12" rx="2" ry="2.5" fill="white" />
        {/* Beak */}
        <ellipse cx="0" cy="-2" rx="4" ry="2.5" fill="#fdb95c" />
        {/* Cheeks */}
        <ellipse cx="-13" cy="-4" rx="4" ry="3" fill="#ffb0ab" opacity="0.4" />
        <ellipse cx="13" cy="-4" rx="4" ry="3" fill="#ffb0ab" opacity="0.4" />
      </g>
    </svg>
  );
}

function PeekPenguin({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 100 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(50,45)">
        {/* Body (only top half visible, peeking up) */}
        <ellipse cx="0" cy="10" rx="30" ry="35" fill="#73d9ff" />
        {/* Belly */}
        <ellipse cx="0" cy="14" rx="21" ry="26" fill="white" />
        {/* Wings */}
        <ellipse
          cx="-26"
          cy="8"
          rx="9"
          ry="18"
          fill="#5cc8ee"
          transform="rotate(10 -26 8)"
        />
        <ellipse
          cx="26"
          cy="8"
          rx="9"
          ry="18"
          fill="#5cc8ee"
          transform="rotate(-10 26 8)"
        />
        {/* Eyes */}
        <ellipse cx="-9" cy="-8" rx="6" ry="7" fill="#1a1a2e" />
        <ellipse cx="-11" cy="-10" rx="2.2" ry="2.8" fill="white" />
        <ellipse cx="9" cy="-8" rx="6" ry="7" fill="#1a1a2e" />
        <ellipse cx="7" cy="-10" rx="2.2" ry="2.8" fill="white" />
        {/* Beak */}
        <ellipse cx="0" cy="0" rx="4.5" ry="3" fill="#fdb95c" />
        {/* Cheeks */}
        <ellipse cx="-15" cy="-2" rx="5" ry="3.5" fill="#ffb0ab" opacity="0.4" />
        <ellipse cx="15" cy="-2" rx="5" ry="3.5" fill="#ffb0ab" opacity="0.4" />
      </g>
    </svg>
  );
}

export default function PenguinMascot({
  variant = "small",
  size = 80,
  className = "",
}: PenguinMascotProps) {
  return (
    <div className={className}>
      {variant === "hero" && <HeroPenguin size={size} />}
      {variant === "small" && <SmallPenguin size={size} />}
      {variant === "peek" && <PeekPenguin size={size} />}
    </div>
  );
}
