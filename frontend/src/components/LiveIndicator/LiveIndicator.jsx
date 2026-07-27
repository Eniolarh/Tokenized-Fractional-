// Copyright (c) 2026 Tokenized Fractional RWA Marketplace Contributors
// SPDX-License-Identifier: MIT

import React, { memo } from 'react';
import styles from './LiveIndicator.module.css';

/**
 * LiveIndicator - Shows a "Live" badge for real-time data feeds
 * 
 * @param {Object} props
 * @param {string} props.variant - Visual variant: 'default' | 'subtle' | 'prominent'
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} props.label - Custom label text (default: "LIVE")
 * @param {boolean} props.showDot - Whether to show pulsing dot (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.tooltip - Tooltip text for accessibility
 */
function LiveIndicator({
  variant = 'default',
  size = 'md',
  label = 'LIVE',
  showDot = true,
  className = '',
  tooltip = 'Real-time updates enabled',
  ...rest
}) {
  const indicatorClass = `${styles.liveIndicator} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <span
      className={indicatorClass}
      title={tooltip}
      aria-label={tooltip}
      role="status"
      aria-live="polite"
      {...rest}
    >
      {showDot && <span className={styles.pulsingDot} aria-hidden="true" />}
      {label}
    </span>
  );
}

export default memo(LiveIndicator);
