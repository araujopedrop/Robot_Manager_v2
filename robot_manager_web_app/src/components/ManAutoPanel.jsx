import React, { useState } from 'react';
import ManVisor from './ManVisor';
import AutoVisor from './AutoVisor';
import gamepad_red from '../assets/gamepad_red.svg'
import gamepad_green from '../assets/gamepad_green.svg'

const ManAutoPanel = () => {
  const [modoAutomatico, setModoAutomatico] = useState(false);

  const handleToggle = () => {
    setModoAutomatico(!modoAutomatico);
  };

  return (
    <div className="component-card lg:col-span-3 h-full flex flex-col">

      {/* Man-Auto Header */}
      <div className="component-header">

        <div className="flex items-center">
          <img className="w-8 h-8" src={gamepad_red} alt="gamepad" />
          <h3 className="component-title">Control del Robot</h3>
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
