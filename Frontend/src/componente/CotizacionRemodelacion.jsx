import React, { useState } from "react";
import { generarPDF } from "../componente/generarPDF";

export default function CotizacionRemodelacion() {
  const [datos, setDatos] = useState({
    cliente: "",
    direccion: "",
    fecha: new Date().toLocaleDateString(),
    observaciones: "",
    valorCotizacion: "", // 👈 nuevo campo
  });

  const [servicios, setServicios] = useState([
    { descripcion: "" },
  ]);

  const agregarFila = () =>
    setServicios([...servicios, { descripcion: "" }]);

  const actualizarServicio = (index, campo, valor) => {
    const nuevos = [...servicios];
    nuevos[index][campo] = valor;
    setServicios(nuevos);
  };

  const handleGenerarPDF = async () => {
    await generarPDF(datos, servicios);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-10 border border-gray-200">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Todo en Reformas M&V
          </h1>
          <p className="text-gray-600 text-sm">
            Servicios integrales en remodelación y construcción
          </p>
        </header>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Cotización de Servicios
        </h2>

        {/* Datos del cliente */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={datos.cliente}
            onChange={(e) => setDatos({ ...datos, cliente: e.target.value })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
          />
          <input
            type="text"
            placeholder="Dirección del proyecto"
            value={datos.direccion}
            onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
          />
          <input
            type="text"
            readOnly
            value={datos.fecha}
            className="border p-2 rounded-md bg-gray-50 text-gray-700"
          />
        </div>

        {/* Lista de servicios */}
        <table className="w-full border-collapse mb-6 text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 text-left">Servicio</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((s, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Ej: Instalación de drywall"
                    value={s.descripcion}
                    onChange={(e) =>
                      actualizarServicio(i, "descripcion", e.target.value)
                    }
                    className="w-full border-none outline-none bg-transparent"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={agregarFila}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            Agregar servicio
          </button>

          {/* Campo de valor manual */}
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-semibold">
              Valor cotización:
            </label>
            <input
              type="number"
              placeholder="0"
              value={datos.valorCotizacion}
              onChange={(e) =>
                setDatos({ ...datos, valorCotizacion: e.target.value })
              }
              className="border p-2 rounded-md w-32 text-right focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        {/* Observaciones */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Observaciones o novedades
          </label>
          <textarea
            rows={4}
            placeholder="Ej: El cliente proveerá los materiales. Se requiere acceso a toma eléctrica."
            value={datos.observaciones}
            onChange={(e) =>
              setDatos({ ...datos, observaciones: e.target.value })
            }
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-600 outline-none resize-none"
          />
        </div>

        <div className="text-right">
          <button
            onClick={handleGenerarPDF}
            className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
