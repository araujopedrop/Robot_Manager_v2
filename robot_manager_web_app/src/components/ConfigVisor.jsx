import React from 'react'

const ConfigVisor = () => {
  return (
      <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Apariencia */}
          <div className="config-section">
            <h3 className="config-section-title">Apariencia</h3>
            <div className="flex items-center justify-between">
              <label className="text-gray-300" htmlFor="darkModeToggle">Modo Oscuro</label>
              <label className="switch">
                <input
                  defaultChecked
                  onChange={() => {}}
                  className="switch-input"
                  id="darkModeToggle"
                  type="checkbox"
                />
                <span className="switch-label">
                  <span className="switch-handle"></span>
                </span>
              </label>
            </div>
          </div>

          {/* Registro */}
          <div className="config-section">
            <h3 className="config-section-title">Registro (Logging)</h3>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  defaultChecked
                  onChange={() => {}}
                  className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  type="checkbox"
                />
                <span className="ml-2 text-gray-300">Habilitar registro de eventos</span>
              </label>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="logFilePath">Ruta del archivo de registro</label>
              <input
                onChange={() => {}}
                className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                id="logFilePath"
                placeholder="/var/log/robot_manager.log"
                type="text"
              />
            </div>
          </div>

          {/* Idioma */}
          <div className="config-section">
            <h3 className="config-section-title">Idioma</h3>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="languageSelect">Seleccionar Idioma</label>
              <select
                defaultValue="es"
                onChange={() => {}}
                className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                id="languageSelect"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Eventos y Alertas */}
          <div className="config-section col-span-1 md:col-span-2">
            <h3 className="config-section-title">Eventos y Alertas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="flex items-center mb-4">
                  <input
                    defaultChecked
                    onChange={() => {}}
                    className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    type="checkbox"
                  />
                  <span className="ml-2 text-gray-300">Habilitar alertas de eventos</span>
                </label>
                <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="alertEmail">Email para alertas</label>
                <input
                  onChange={() => {}}
                  className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  id="alertEmail"
                  placeholder="alerts@example.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="alertTypes">Tipos de alerta a recibir</label>
                <select
                  multiple
                  defaultValue={["Todos"]}
                  onChange={() => {}}
                  className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-32"
                  id="alertTypes"
                >
                  <option value="Todos">Todos</option>
                  <option value="Error crítico">Error crítico</option>
                  <option value="Batería baja">Batería baja</option>
                  <option value="Misión completada">Misión completada</option>
                  <option value="Conexión perdida">Conexión perdida</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="alertTimePeriod">Período de tiempo para alertas</label>
                <select
                  defaultValue="Siempre"
                  onChange={() => {}}
                  className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  id="alertTimePeriod"
                >
                  <option>Últimas 24 horas</option>
                  <option>Últimos 7 días</option>
                  <option>Últimos 30 días</option>
                  <option>Siempre</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300" htmlFor="alertFrequency">Frecuencia de envío de eventos</label>
                <div className="flex space-x-2">
                  <input
                    onChange={() => {}}
                    className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    id="alertFrequencyValue"
                    placeholder="30"
                    type="number"
                  />
                  <select
                    defaultValue="minutes"
                    onChange={() => {}}
                    className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5"
                    id="alertFrequencyUnit"
                  >
                    <option value="minutes">Minutos</option>
                    <option value="hours">Horas</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button className="btn btn-secondary">
            <span className="material-icons mr-2">cancel</span> Cancelar
          </button>
          <button className="btn btn-primary">
            <span className="material-icons mr-2">save</span> Guardar Cambios
          </button>
        </div>

      </div>
  )
}

export default ConfigVisor
