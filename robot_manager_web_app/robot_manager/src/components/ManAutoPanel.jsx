import React, { useState, useEffect, useRef } from 'react';
import ManVisor from './ManVisor';
import AutoVisor from './AutoVisor';
import gamepad_red from '../assets/gamepad_red.svg';
import gamepad_green from '../assets/gamepad_green.svg';

const WS_BASE =
  import.meta.env.VITE_WS_BASE?.replace(/\/$/, '') || 'ws://localhost:8000';

const STALE_MS = 3000;

const ManAutoPanel = () => {
  const [modoAutomatico, setModoAutomatico] = useState(false);
  const [hasOdom, setHasOdom] = useState(false);
  const [connStatus, setConnStatus] = useState('');

  const wsRef = useRef(null);
  const staleTimerRef = useRef(null);
  const backoffRef = useRef(1000); // 1s inicial
  const closedByUserRef = useRef(false);

  const clearStaleTimer = () => {
    if (staleTimerRef.current) {
      clearTimeout(staleTimerRef.current);
      staleTimerRef.current = null;
    }
  };

  const armStaleTimer = () => {
    clearStaleTimer();
    staleTimerRef.current = setTimeout(() => {
      setHasOdom(false);
    }, STALE_MS);
  };

  const connect = () => {
    if (closedByUserRef.current) return;

    try {
      const ws = new WebSocket(`${WS_BASE}/ws/odom`);
      wsRef.current = ws;

      ws.onopen = () => {
        setHasOdom(false);
        backoffRef.current = 1000; // reset backoff al conectar
        armStaleTimer();
      };

      ws.onmessage = () => {
        // No necesitamos parsear si no usamos los datos; el objetivo es “llego algo”
        setHasOdom(true);
        armStaleTimer();
      };

      ws.onerror = () => {
        // El onclose manejará la reconexión; solo marcamos estado
        setHasOdom(false);
      };

      ws.onclose = () => {
        clearStaleTimer();
        setHasOdom(false);
        if (!closedByUserRef.current) {
          const delay = Math.min(backoffRef.current, 10000); // tope 10s
          setTimeout(connect, delay);
          backoffRef.current *= 2;
        }
      };
    } catch {
      setHasOdom(false);
      // Intento de reconexión básico
      const delay = Math.min(backoffRef.current, 10000);
      setTimeout(connect, delay);
      backoffRef.current *= 2;
    }
  };

  useEffect(() => {
    closedByUserRef.current = false;
    connect();

    // Pausar/rearmar watchdog al cambiar visibilidad (opcional)
    const onVisChange = () => {
      if (document.hidden) {
        clearStaleTimer();
      } else if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        armStaleTimer();
      }
    };
    document.addEventListener('visibilitychange', onVisChange);

    return () => {
      closedByUserRef.current = true;
      document.removeEventListener('visibilitychange', onVisChange);
      clearStaleTimer();
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, []); // << importante: deps vacías

  const handleToggle = () => setModoAutomatico((v) => !v);

  return (
    <div className="component-card lg:col-span-3 h-full flex flex-col">
      {/* Header */}
      <div className="component-header">
        {/* Title + odom indicator */}
        <div className="flex items-center gap-2">
          <img
            className="w-8 h-8"
            src={hasOdom ? gamepad_green : gamepad_red}
            alt={hasOdom ? 'Odometría activa' : 'Sin odometría'}
            title={`${hasOdom ? 'Odometría OK' : 'Sin odometría'} • ${connStatus}`}
          />
          <h3 className="component-title">Control del Robot</h3>
          <span className="ml-2 text-xs text-gray-400 select-none">{connStatus}</span>
        </div>

        {/* Man-Auto Slider */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Manual</span>

          <label className="switch">
            <input
              type="checkbox"
              className="switch-input"
              checked={modoAutomatico}
              onChange={handleToggle}
              aria-label="Cambiar a modo automático"
            />
            <span className="switch-label">
              <span className="switch-handle"></span>
            </span>
          </label>

          <span className="text-sm text-gray-300">Automático</span>
        </div>
      </div>

      {/* Content */}
      <div className="component-content flex-grow p-6 overflow-auto">
        {modoAutomatico ? <AutoVisor /> : <ManVisor />}
      </div>
    </div>
  );
};

export default ManAutoPanel;

