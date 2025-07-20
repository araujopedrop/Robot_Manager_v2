import React from 'react'

const MissionVisor = () => {
  return (
        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">

        <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Listado de Misiones</h3>
            <button className="btn btn-primary">
            <span className="material-icons mr-2">add</span> Nueva Misión
            </button>
        </div>

        <div className="card overflow-hidden">
            <div className="overflow-x-auto">
            <table className="min-w-full">

                <thead>
                    <tr>
                        <th>Nombre de Misión</th>
                        <th>Planta</th>
                        <th>Estado</th>
                        <th>Inicio / Fin</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>

                <tr>
                    <td>Patrulla Nocturna Sector A</td>
                    <td>Planta Principal</td>
                    <td><span className="status-badge status-inprogress">En Progreso</span></td>
                    <td>
                        <div className="flex flex-col">
                            <span>14/07/2024 22:00</span>
                            <span className="text-gray-400">--- ---</span>
                        </div>
                    </td>
                    <td className="flex items-center space-x-2">
                        <button className="btn-icon text-blue-400 hover:text-blue-300" title="Modificar Misión">
                            <span className="material-icons">edit</span>
                        </button>
                        <button className="btn-icon text-red-400 hover:text-red-300" title="Eliminar Misión">
                            <span className="material-icons">delete</span>
                        </button>
                    </td>
                </tr>

                <tr>
                    <td>Inspección de Equipos Críticos</td>
                    <td>Planta Secundaria</td>
                    <td><span className="status-badge status-completed">Completada</span></td>
                    <td>
                        <div className="flex flex-col">
                            <span>13/07/2024 10:15</span>
                            <span className="text-gray-400">13/07/2024 11:30</span>
                        </div>
                    </td>
                    <td className="flex items-center space-x-2">
                    <button className="btn-icon text-blue-400 hover:text-blue-300" title="Modificar Misión">
                        <span className="material-icons">edit</span>
                    </button>
                    <button className="btn-icon text-red-400 hover:text-red-300" title="Eliminar Misión">
                        <span className="material-icons">delete</span>
                    </button>
                    </td>
                </tr>

                <tr>
                    <td>Mapeo Área de Expansión</td>
                    <td>Planta Principal</td>
                    <td><span className="status-badge status-pending">Pendiente</span></td>
                    <td>
                        <div className="flex flex-col">
                            <span>15/07/2024 09:00</span>
                            <span className="text-gray-400">--- ---</span>
                        </div>
                    </td>
                    <td className="flex items-center space-x-2">
                        <button className="btn-icon text-blue-400 hover:text-blue-300" title="Modificar Misión">
                            <span className="material-icons">edit</span>
                        </button>
                        <button className="btn-icon text-red-400 hover:text-red-300" title="Eliminar Misión">
                            <span className="material-icons">delete</span>
                        </button>
                    </td>
                </tr>

                <tr>
                    <td>Escaneo de Seguridad Perimetral</td>
                    <td>Almacén Externo</td>
                    <td><span className="status-badge status-error">Error</span></td>
                    <td>
                        <div className="flex flex-col">
                            <span>12/07/2024 14:00</span>
                            <span className="text-gray-400">--- ---</span>
                        </div>
                    </td>
                    <td className="flex items-center space-x-2">
                    <button className="btn-icon text-blue-400 hover:text-blue-300" title="Modificar Misión">
                        <span className="material-icons">edit</span>
                    </button>
                    <button className="btn-icon text-red-400 hover:text-red-300" title="Eliminar Misión">
                        <span className="material-icons">delete</span>
                    </button>
                    </td>
                </tr>

                <tr>
                    <td>Transporte de Muestras Laboratorio</td>
                    <td>Planta Principal</td>
                    <td><span className="status-badge status-inprogress">En Progreso</span></td>

                    <td>
                        <div className="flex flex-col">
                            <span>14/07/2024 15:30</span>
                            <span className="text-gray-400">--- ---</span>
                        </div>
                    </td>

                    <td className="flex items-center space-x-2">
                        <button className="btn-icon text-blue-400 hover:text-blue-300" title="Modificar Misión">
                            <span className="material-icons">edit</span>
                        </button>
                        <button className="btn-icon text-red-400 hover:text-red-300" title="Eliminar Misión">
                            <span className="material-icons">delete</span>
                        </button>
                    </td>
                </tr>

                </tbody>

            </table>
            </div>
        </div>

        </div>
  )
}

export default MissionVisor
