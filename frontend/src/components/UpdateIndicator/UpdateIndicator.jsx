// Copyright (c) 2026 Tokenized Fractional RWA Marketplace Contributors
// SPDX-License-Identifier: MIT

import React, { memo, useEffect, useState } from 'react';
import styles from './UpdateIndicator.module.css';

/**
 * UpdateIndicator - Shows animated indicators for different types of real-time updates
 * 
 * @param {Object} props
 * @param {'price' | 'transaction' | 'status' | 'availability'} props.type - Update type
 * @param {boolean} props.active - Whether the indicator is currently animating
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} props.position - Position relative to content: 'inline' | 'absolute'
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.tooltip - Custom tooltip text
 */
function UpdateIndicator({
  type = 'price',
  active = false,
  size = 'md',
  position = 'inline',
  className = '',
  tooltip,
  ...rest
}) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (active) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  const typeConfig = {
    price: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      defaultTooltip: 'Price updated in real-time',
      color: 'price',
    },
    transaction: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      defaultTooltip: 'New transaction detected',
      color: 'transaction',
    },
    status: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      defaultTooltip: 'Status changed',
      color: 'status',
    },
    availability: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" />
        </svg>
      ),
      defaultTooltip: 'Availability updated',
      color: 'availability',
    },
  };

  const config = typeConfig[type] || typeConfig.price;
  const containerClass = `${styles.updateIndicator} ${styles[size]} ${styles[position]} ${styles[config.color]} ${animating ? styles.animating : ''} ${className}`;

  return (
    <span
      className={containerClass}
      title={tooltip || config.defaultTooltip}
      aria-label={tooltip || config.defaultTooltip}
      role="status"
      aria-live="polite"
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {config.icon}
      </span>
      {animating && <span className={styles.ripple} aria-hidden="true" />}
    </span>
  );
}

export default memo(UpdateIndicator);
