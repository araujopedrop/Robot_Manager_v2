import React from 'react'

const RobotVisor = () => {
  return (
        <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">

        <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Lista de Robots</h3>
            <button className="btn btn-primary">
            <span className="material-icons mr-2">add</span> Nuevo Robot
            </button>
        </div>

        <div className="card overflow-x-auto">
            <table className="min-w-full">

            <thead>
                <tr>
                    <th>Robot Name</th>
                    <th>Robot Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td className="text-white">Robot Alpha 1</td>
                    <td className="text-gray-300">Móvil Terrestre</td>
                    <td><span className="status-badge status-online">Online</span></td>
                    <td className="flex space-x-2">
                        <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                            <span className="material-icons text-sm">edit</span>
                        </button>
                        <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                            <span className="material-icons text-sm">delete</span>
                        </button>
                    </td>
                </tr>

                <tr>
                    <td className="text-white">Robot Beta 7</td>
                    <td className="text-gray-300">Dron Aéreo</td>
                    <td><span className="status-badge status-offline">Offline</span></td>
                    <td className="flex space-x-2">
                        <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                            <span className="material-icons text-sm">edit</span>
                        </button>
                        <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                            <span className="material-icons text-sm">delete</span>
                        </button>
                    </td>
                </tr>

                <tr>
                    <td className="text-white">Robot Gamma 3</td>
                    <td className="text-gray-300">Manipulador Industrial</td>
                    <td><span className="status-badge status-maintenance">En Mantenimiento</span></td>
                    <td className="flex space-x-2">
                        <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                            <span className="material-icons text-sm">edit</span>
                        </button>
                        <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                            <span className="material-icons text-sm">delete</span>
                        </button>
                    </td>
                </tr>

                <tr>
                    <td className="text-white">Robot Delta 9</td>
                    <td className="text-gray-300">Móvil Acuático</td>
                    <td><span className="status-badge status-online">Online</span></td>
                    <td className="flex space-x-2">
                        <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                            <span className="material-icons text-sm">edit</span>
                        </button>
                        <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                            <span className="material-icons text-sm">delete</span>
                        </button>
                    </td>
                </tr>

                <tr>
                    <td className="text-white">Robot Epsilon 2</td>
                    <td className="text-gray-300">Humanoide</td>
                    <td><span className="status-badge status-offline">Offline</span></td>
                    <td className="flex space-x-2">
                        <button className="btn-icon btn-secondary p-2 rounded-md hover:bg-gray-600 transition-colors duration-200" title="Editar">
                            <span className="material-icons text-sm">edit</span>
                        </button>
                        <button className="btn-icon btn-danger p-2 rounded-md hover:bg-red-700 transition-colors duration-200" title="Eliminar">
                            <span className="material-icons text-sm">delete</span>
                        </button>
                    </td>
                </tr>

            </tbody>

            </table>
        </div>

        </div>
  )
}

export default RobotVisor
