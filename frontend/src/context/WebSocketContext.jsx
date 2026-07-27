// Copyright (c) 2026 Tokenized Fractional RWA Marketplace Contributors
// SPDX-License-Identifier: MIT

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useMarketplaceWebSocket, WS_EVENT_TYPES } from '../hooks/useWebSocket';

/**
 * WebSocketContext - Provides global WebSocket state and update indicator management
 * 
 * This context wraps the useMarketplaceWebSocket hook and adds:
 * - Connection status tracking (connected, connecting, disconnected, error)
 * - Update type tracking for animated indicators
 * - Global event broadcasting for update indicators
 * - Retry functionality for failed connections
 */
const WebSocketContext = createContext(null);

/**
 * Hook to access WebSocket context
 */
export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}

/**
 * WebSocketProvider - Wraps the application with WebSocket context
 * 
 * @param {Object} props
 * @param {string} props.wsUrl - WebSocket server URL
 * @param {React.ReactNode} props.children - Child components
 */
export function WebSocketProvider({ wsUrl, children }) {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [activeUpdate, setActiveUpdate] = useState(null);
  const [updateTimestamp, setUpdateTimestamp] = useState(null);
  const [errorCount, setErrorCount] = useState(0);

  // Handle WebSocket events
  const handleEvent = useCallback((message) => {
    if (!message.type || !message.data) return;

    switch (message.type) {
      case WS_EVENT_TYPES.CONNECTION_ESTABLISHED:
        setConnectionStatus('connected');
        setErrorCount(0);
        break;

      case WS_EVENT_TYPES.SHARE_PURCHASED:
        setActiveUpdate('transaction');
        setUpdateTimestamp(Date.now());
        setTimeout(() => setActiveUpdate(null), 2000);
        break;

      case WS_EVENT_TYPES.PRICE_UPDATED:
        setActiveUpdate('price');
        setUpdateTimestamp(Date.now());
        setTimeout(() => setActiveUpdate(null), 2000);
        break;

      case WS_EVENT_TYPES.AVAILABILITY_CHANGED:
        setActiveUpdate('availability');
        setUpdateTimestamp(Date.now());
        setTimeout(() => setActiveUpdate(null), 2000);
        break;

      case WS_EVENT_TYPES.ASSET_UPDATED:
        setActiveUpdate('status');
        setUpdateTimestamp(Date.now());
        setTimeout(() => setActiveUpdate(null), 2000);
        break;

      case WS_EVENT_TYPES.MARKETPLACE_PAUSED:
      case WS_EVENT_TYPES.MARKETPLACE_UNPAUSED:
        setActiveUpdate('status');
        setUpdateTimestamp(Date.now());
        setTimeout(() => setActiveUpdate(null), 2000);
        break;

      case WS_EVENT_TYPES.ERROR:
        setConnectionStatus('error');
        setErrorCount(prev => prev + 1);
        break;

      default:
        // Unknown event type - ignore
        break;
    }
  }, []);

  // Handle WebSocket errors
  const handleError = useCallback((error) => {
    console.error('WebSocket error:', error);
    setConnectionStatus('error');
    setErrorCount(prev => prev + 1);
  }, []);

  // Initialize WebSocket connection
  const { connected, clientId, disconnect } = useMarketplaceWebSocket(wsUrl, handleEvent, {
    enabled: process.env.NODE_ENV !== 'test',
    reconnectAttempts: 5,
    reconnectDelay: 3000,
    onError: handleError,
  });

  // Update connection status based on connected state
  useEffect(() => {
    if (connected) {
      setConnectionStatus('connected');
    } else if (connectionStatus !== 'error') {
      setConnectionStatus('connecting');
    }
  }, [connected, connectionStatus]);

  // Manual retry function
  const retryConnection = useCallback(() => {
    setConnectionStatus('connecting');
    setErrorCount(0);
    // The useWebSocket hook will automatically attempt reconnection
  }, []);

  // Trigger an update indicator manually (for local updates)
  const triggerUpdate = useCallback((type) => {
    setActiveUpdate(type);
    setUpdateTimestamp(Date.now());
    setTimeout(() => setActiveUpdate(null), 2000);
  }, []);

  const value = {
    // Connection state
    connected,
    connectionStatus,
    clientId,
    errorCount,
    
    // Update state
    activeUpdate,
    updateTimestamp,
    
    // Actions
    disconnect,
    retryConnection,
    triggerUpdate,
    
    // Event types for reference
    eventTypes: WS_EVENT_TYPES,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
