// Copyright (c) 2026 Tokenized Fractional RWA Marketplace Contributors
// SPDX-License-Identifier: MIT

import React, { memo } from 'react';
import styles from './ConnectionBanner.module.css';

/**
 * ConnectionBanner - Shows user guidance when WebSocket connection fails
 * 
 * @param {Object} props
 * @param {'error' | 'disconnected'} props.status - Connection status
 * @param {Function} props.onRetry - Callback when retry button clicked
 * @param {boolean} props.show - Whether to show the banner
 * @param {string} props.className - Additional CSS classes
 */
function ConnectionBanner({ status = 'disconnected', onRetry, show = true, className = '', ...rest }) {
  if (!show) return null;

  const messages = {
    disconnected: {
      title: 'Real-time updates unavailable',
      description: 'Unable to connect to real-time data feed. Prices and availability may not be current.',
      actionText: 'Retry Connection',
    },
    error: {
      title: 'Connection error',
      description: 'An error occurred with the real-time data connection. Some features may be limited.',
      actionText: 'Try Again',
    },
  };

  const config = messages[status] || messages.disconnected;
  const bannerClass = `${styles.connectionBanner} ${styles[status]} ${className}`;

  return (
    <div
      className={bannerClass}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      {...rest}
    >
      <div className={styles.iconContainer}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15 91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{config.title}</h3>
        <p className={styles.description}>{config.description}</p>
      </div>

      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
          aria-label="Retry connection"
        >
          {config.actionText}
        </button>
      )}
    </div>
  );
}

export default memo(ConnectionBanner);
