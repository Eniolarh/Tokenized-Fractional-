// Copyright (c) 2026 Tokenized Fractional RWA Marketplace Contributors
// SPDX-License-Identifier: MIT

import React, { memo } from 'react';
import styles from './ConnectionStatus.module.css';

/**
 * ConnectionStatus - Shows WebSocket connection health status
 * 
 * @param {Object} props
 * @param {'connected' | 'connecting' | 'disconnected' | 'error'} props.status - Connection state
 * @param {string} props.size - Size variant: 'sm' | 'md' | 'lg'
 * @param {boolean} props.showLabel - Whether to show text label (default: true)
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onRetry - Callback when retry button clicked (for error state)
 */
function ConnectionStatus({
  status = 'disconnected',
  size = 'md',
  showLabel = true,
  className = '',
  onRetry,
  ...rest
}) {
  const statusConfig = {
    connected: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      label: 'Connected',
      ariaLabel: 'WebSocket connected - real-time updates active',
      color: 'success',
    },
    connecting: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={styles.spinning}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      ),
      label: 'Connecting...',
      ariaLabel: 'WebSocket connecting - establishing real-time connection',
      color: 'warning',
    },
    disconnected: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      ),
      label: 'Disconnected',
      ariaLabel: 'WebSocket disconnected - real-time updates unavailable',
      color: 'error',
    },
    error: {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      label: 'Connection Error',
      ariaLabel: 'WebSocket connection error - real-time updates unavailable',
      color: 'error',
    },
  };

  const config = statusConfig[status] || statusConfig.disconnected;
  const containerClass = `${styles.connectionStatus} ${styles[size]} ${styles[config.color]} ${className}`;

  return (
    <div
      className={containerClass}
      role="status"
      aria-live="polite"
      aria-label={config.ariaLabel}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {config.icon}
      </span>
      {showLabel && <span className={styles.label}>{config.label}</span>}
      {status === 'error' && onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          aria-label="Retry connection"
          type="button"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default memo(ConnectionStatus);
