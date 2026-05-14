import type { CSSProperties } from 'react';
import styles from './FCCrest.module.css';

interface FCCrestProps {
  urls: ReadonlyArray<string>;
  fallbackLabel: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders an FFXIV FC crest by stacking 1-3 Lodestone PNGs into a single
 * pseudo-image. Falls back to a colored disc with the FC's first letter when
 * no crest URLs are available (Lodestone fetch failed or new FC).
 */
export function FCCrest({ urls, fallbackLabel, size = 80, className, style }: FCCrestProps) {
  const dims: CSSProperties = { width: size, height: size, ...style };

  if (urls.length === 0) {
    return (
      <div className={`${styles.fallback} ${className ?? ''}`} style={dims} aria-hidden="true">
        <span style={{ fontSize: size * 0.42 }}>{fallbackLabel.charAt(0).toUpperCase() || '?'}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.stack} ${className ?? ''}`} style={dims} aria-hidden="true">
      {urls.map((url, i) => (
        <img
          key={url}
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          width={size}
          height={size}
          className={styles.layer}
          style={{ zIndex: i }}
        />
      ))}
    </div>
  );
}
