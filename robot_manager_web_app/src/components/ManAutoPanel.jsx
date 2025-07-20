import React, { useState } from 'react';
import ManVisor from './ManVisor';
import AutoVisor from './AutoVisor';

const ManAutoPanel = () => {
  const [modoAutomatico, setModoAutomatico] = useState(false);

  const handleToggle = () => {
    setModoAutomatico(!modoAutomatico);
  };

  return (
    <div className="component-card lg:col-span-3 h-full flex flex-col">

      {/* Header con slider */}
      <div className="component-header">
        <div className="flex items-center">
          <span className="material-icons text-red-400">gamepad</span>
          <h3 className="component-title">Control del Robot</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Manual</span>
          <label className="switch">
            <input
              type="checkbox"
              className="switch-input"
              checked={modoAutomatico}
              onChange={handleToggle}
            />
            <span className="switch-label">
              <span className="switch-handle"></span>
            </span>
          </label>
          <span className="text-sm text-gray-300">Automático</span>
        </div>
      </div>

      {/* Man-Auto Visor */}
      <div className="component-content flex-grow p-6 overflow-auto">
        {modoAutomatico ? <AutoVisor /> : <ManVisor />}
      </div>
    </div>
  );
};

export default ManAutoPanel;
