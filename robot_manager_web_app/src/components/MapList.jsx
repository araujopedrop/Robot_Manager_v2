import React from 'react'

const MapList = () => {
  return (
      <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">

        <div className="mb-6 flex justify-end">
            <button className="btn btn-primary">
                <span className="material-icons mr-2">add</span> Crear Mapa
            </button>
        </div>

        <div className="card">
            <div className="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th className="rounded-tl-lg">Nombre del Mapa</th>
                            <th>Nombre de la Planta</th>
                            <th className="rounded-tr-lg">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr>
                            <td>Mapa Almacén Principal</td>
                            <td>Planta A</td>
                            <td className="flex space-x-1">
                                <button className="btn-icon btn-secondary" title="Modificar mapa">
                                    <span className="material-icons text-base">edit</span>
                                </button>
                                <button className="btn-icon btn-danger" title="Eliminar mapa">
                                    <span className="material-icons text-base">delete</span>
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>Mapa Zona de Carga</td>
                            <td>Planta A</td>
                            <td className="flex space-x-1">
                                <button className="btn-icon btn-secondary" title="Modificar mapa">
                                    <span className="material-icons text-base">edit</span>
                                </button>
                                <button className="btn-icon btn-danger" title="Eliminar mapa">
                                    <span className="material-icons text-base">delete</span>
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td>Mapa Oficinas</td>
                            <td>Planta B</td>
                            <td className="flex space-x-1">
                                <button className="btn-icon btn-secondary" title="Modificar mapa">
                                    <span className="material-icons text-base">edit</span>
                                </button>
                                <button className="btn-icon btn-danger" title="Eliminar mapa">
                                    <span className="material-icons text-base">delete</span>
                                </button>
                            </td>
                        </tr>

                        <tr>
                            <td className="rounded-bl-lg">Mapa Laboratorio</td>
                            <td>Planta B</td>
                            <td className="rounded-br-lg flex space-x-1">
                                <button className="btn-icon btn-secondary" title="Modificar mapa">
                                    <span className="material-icons text-base">edit</span>
                                </button>
                                <button className="btn-icon btn-danger" title="Eliminar mapa">
                                    <span className="material-icons text-base">delete</span>
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

export default MapList
