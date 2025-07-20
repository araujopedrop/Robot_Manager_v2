import React from 'react'

const AutoVisor = () => {
  return (
    <div className="component-content !p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="mission-select">Seleccionar Misión:</label>
            <select className="block w-full bg-gray-700 border-gray-600 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5" id="mission-select" name="mission-select">
              <option>Misión 1: Patrulla Sector A</option>
              <option>Misión 2: Escaneo Área de Carga</option>
              <option>Misión 3: Regreso a Base</option>
              <option>Misión 4: Ir a Estación de Carga</option>
            </select>
          </div>

          <div className="bg-gray-700/50 rounded-lg max-h-60 overflow-y-auto">
            <ul className="divide-y divide-gray-600/70">
              <li className="action-item">
                <div className="flex items-center">
                  <span className="material-icons action-item-icon">play_circle_outline</span>
                  <span className="action-item-text">Iniciar Patrulla Sector A</span>
                </div>
                <div className="status-circle bg-green-500"></div>
              </li>
              <li className="action-item">
                <div className="flex items-center">
                  <span className="material-icons action-item-icon">sync</span>
                  <span className="action-item-text">Escanear Área de Carga</span>
                </div>
                <div className="status-circle-empty"></div>
              </li>
              <li className="action-item">
                <div className="flex items-center">
                  <span className="material-icons action-item-icon">home</span>
                  <span className="action-item-text">Regresar a Base</span>
                </div>
                <div className="status-circle-empty"></div>
              </li>
              <li className="action-item">
                <div className="flex items-center">
                  <span className="material-icons action-item-icon">battery_charging_full</span>
                  <span className="action-item-text">Ir a Estación de Carga</span>
                </div>
                <div className="status-circle-empty"></div>
              </li>
              <li className="action-item">
                <div className="flex items-center">
                  <span className="material-icons action-item-icon">cleaning_services</span>
                  <span className="action-item-text">Limpiar Sensores</span>
                </div>
                <div className="status-circle-empty"></div>
              </li>
              <li className="action-item">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="material-icons action-item-icon">report_problem</span>
                    <span className="action-item-text">Reportar Incidente</span>
                  </div>
                  <span className="action-item-status bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">Crítico</span>
                </div>
              </li>
            </ul>
          </div>
        </div> 

        <div className="md:col-span-1 flex flex-col justify-between h-full mt-7 space-y-4">
          <div className="space-y-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center w-full justify-center">
              <span className="material-icons mr-2">play_arrow</span> Iniciar Misión
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg flex items-center w-full justify-center">
              <span className="material-icons mr-2">stop</span> Detener Misión
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center w-full justify-center">
              <span className="material-icons mr-2">stop_circle</span> Parada de Emergencia
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AutoVisor;
