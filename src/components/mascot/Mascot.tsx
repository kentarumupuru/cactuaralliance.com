import { useId, type CSSProperties } from 'react';
import styles from './Mascot.module.css';

export type MascotPose = 'wave' | 'sign' | 'think';

interface MascotProps {
  pose?: MascotPose;
  signText?: string;
  size?: number | string;
  animated?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * The Sabotender mascot — a friendly desert cactus shaped after FFXIV's iconic
 * Cactuar. Drawn inline so colors theme via CSS variables and motion respects
 * prefers-reduced-motion through the global override.
 */
export function Mascot({
  pose = 'wave',
  signText = 'Welcome!',
  size = 220,
  animated = true,
  ariaLabel,
  className,
  style,
}: MascotProps) {
  const id = useId();
  const label = ariaLabel ?? defaultLabel(pose);

  const classes = [
    styles.mascot,
    styles[`pose-${pose}`],
    animated ? styles.animated : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={classes}
      style={{ width: typeof size === 'number' ? `${size}px` : size, ...style }}
      viewBox="0 0 220 260"
      role="img"
      aria-label={label}
    >
      <title>{label}</title>

      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--c-sage-300)" />
          <stop offset="100%" stopColor="var(--c-sage-500)" />
        </linearGradient>
        <radialGradient id={`${id}-cheek`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--c-pink-400)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--c-pink-400)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="110" cy="240" rx="62" ry="8" fill="var(--c-ink-900)" opacity="0.14" />

      {/* ============= LEFT ARM (waving in wave pose) ============= */}
      <g className={styles.armLeft}>
        <rect
          x="22"
          y="118"
          width="34"
          height="64"
          rx="14"
          fill={`url(#${id}-body)`}
          stroke="var(--c-sage-700)"
          strokeWidth="2.5"
        />
        {/* spines on left arm */}
        <SpineCluster cx={28} cy={140} />
        <SpineCluster cx={50} cy={150} />
        <SpineCluster cx={28} cy={166} />
      </g>

      {/* ============= RIGHT ARM (holds sign in sign pose) ============= */}
      <g className={styles.armRight}>
        <rect
          x="164"
          y="118"
          width="34"
          height="64"
          rx="14"
          fill={`url(#${id}-body)`}
          stroke="var(--c-sage-700)"
          strokeWidth="2.5"
        />
        <SpineCluster cx={170} cy={140} />
        <SpineCluster cx={192} cy={150} />
        <SpineCluster cx={170} cy={166} />

        {pose === 'sign' && (
          <g className={styles.sign}>
            {/* Sign post */}
            <rect x="178" y="60" width="4" height="68" fill="var(--c-sand-500)" />
            {/* Sign board */}
            <g transform="translate(120 28)">
              <rect
                x="0"
                y="0"
                width="120"
                height="50"
                rx="8"
                fill="var(--c-sand-100)"
                stroke="var(--c-sand-500)"
                strokeWidth="3"
              />
              <text
                x="60"
                y="32"
                textAnchor="middle"
                fontFamily="var(--font-display, Fredoka, sans-serif)"
                fontSize="20"
                fontWeight="600"
                fill="var(--c-sage-700)"
              >
                {signText}
              </text>
            </g>
          </g>
        )}
      </g>

      {/* ============= BODY ============= */}
      <g className={styles.body}>
        <rect
          x="62"
          y="56"
          width="96"
          height="160"
          rx="32"
          fill={`url(#${id}-body)`}
          stroke="var(--c-sage-700)"
          strokeWidth="3"
        />

        {/* Body spines */}
        <SpineCluster cx={78} cy={90} />
        <SpineCluster cx={142} cy={90} />
        <SpineCluster cx={110} cy={110} />
        <SpineCluster cx={78} cy={140} />
        <SpineCluster cx={142} cy={140} />
        <SpineCluster cx={110} cy={160} />
        <SpineCluster cx={78} cy={190} />
        <SpineCluster cx={142} cy={190} />

        {/* Cheeks */}
        <ellipse cx="84" cy="138" rx="13" ry="9" fill={`url(#${id}-cheek)`} />
        <ellipse cx="136" cy="138" rx="13" ry="9" fill={`url(#${id}-cheek)`} />

        {/* Eyes */}
        <g className={styles.eyes}>
          <Eye cx={90} cy={118} closed={pose === 'think'} />
          <Eye cx={130} cy={118} closed={pose === 'think'} />
        </g>

        {/* Mouth — varies by pose */}
        {pose === 'wave' && (
          <path
            d="M 96 145 Q 110 155 124 145"
            fill="none"
            stroke="var(--c-ink-900)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {pose === 'sign' && (
          <path
            d="M 96 148 Q 110 142 124 148"
            fill="none"
            stroke="var(--c-ink-900)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {pose === 'think' && (
          <ellipse
            cx="110"
            cy="148"
            rx="6"
            ry="4"
            fill="var(--c-ink-900)"
          />
        )}
      </g>

      {/* ============= FEET ============= */}
      <g className={styles.feet}>
        <ellipse cx="86" cy="222" rx="18" ry="10" fill="var(--c-sage-700)" />
        <ellipse cx="134" cy="222" rx="18" ry="10" fill="var(--c-sage-700)" />
      </g>

      {/* ============= THOUGHT BUBBLE (think pose) ============= */}
      {pose === 'think' && (
        <g className={styles.thoughtBubble}>
          <circle cx="170" cy="80" r="6" fill="var(--surface-raised)" stroke="var(--c-sage-700)" strokeWidth="2" />
          <circle cx="180" cy="60" r="9" fill="var(--surface-raised)" stroke="var(--c-sage-700)" strokeWidth="2" />
          <circle cx="196" cy="36" r="16" fill="var(--surface-raised)" stroke="var(--c-sage-700)" strokeWidth="2.5" />
          <text
            x="196"
            y="42"
            textAnchor="middle"
            fontFamily="var(--font-display, Fredoka, sans-serif)"
            fontSize="20"
            fontWeight="700"
            fill="var(--c-sage-700)"
          >
            ?
          </text>
        </g>
      )}
    </svg>
  );
}

function Eye({ cx, cy, closed }: { cx: number; cy: number; closed: boolean }) {
  if (closed) {
    return (
      <path
        d={`M ${cx - 6} ${cy} Q ${cx} ${cy + 4} ${cx + 6} ${cy}`}
        fill="none"
        stroke="var(--c-ink-900)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  }
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="5" ry="6" fill="var(--c-ink-900)" />
      <circle cx={cx + 1.5} cy={cy - 1.8} r="1.6" fill="#fff" />
    </g>
  );
}

function SpineCluster({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g stroke="var(--c-sage-700)" strokeWidth="1.5" strokeLinecap="round">
      <line x1={cx - 3} y1={cy - 2} x2={cx - 6} y2={cy - 5} />
      <line x1={cx} y1={cy - 3} x2={cx} y2={cy - 7} />
      <line x1={cx + 3} y1={cy - 2} x2={cx + 6} y2={cy - 5} />
    </g>
  );
}

function defaultLabel(pose: MascotPose): string {
  switch (pose) {
    case 'wave':
      return 'Sabotender mascot waving hello';
    case 'sign':
      return 'Sabotender mascot holding a sign';
    case 'think':
      return 'Sabotender mascot thinking';
  }
}
