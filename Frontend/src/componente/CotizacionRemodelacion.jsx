import React, { useState } from "react";
import { generarPDF } from "../componente/generarPDF";

export default function CotizacionRemodelacion() {
  const [datos, setDatos] = useState({
    cliente: "",
    direccion: "",
    fecha: new Date().toLocaleDateString(),
    observaciones: "",
    valorCotizacion: "",
  });

  const [servicios, setServicios] = useState([{ descripcion: "" }]);

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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6 sm:p-8 md:p-10 border border-gray-200">
        {/* ENCABEZADO */}
        <header className="mb-6 sm:mb-8 border-b pb-4 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Todo en Reformas M&V
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Servicios integrales en remodelación y construcción
          </p>
        </header>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center md:text-left">
          Cotización de Servicios
        </h2>

        {/* DATOS DEL CLIENTE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={datos.cliente}
            onChange={(e) => setDatos({ ...datos, cliente: e.target.value })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-600 outline-none w-full"
          />
          <input
            type="text"
            placeholder="Dirección del proyecto"
            value={datos.direccion}
            onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-600 outline-none w-full"
          />
          <input
            type="text"
            readOnly
            value={datos.fecha}
            className="border p-2 rounded-md bg-gray-50 text-gray-700 w-full"
          />
        </div>

        {/* SERVICIOS */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse text-sm sm:text-base">
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
                      className="w-full border-none outline-none bg-transparent text-sm sm:text-base"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTÓN + VALOR */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          {/* Botón agregar servicio */}
          <button
            onClick={agregarFila}
            className="w-full md:w-auto px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm sm:text-base"
          >
            Agregar servicio
          </button>

          {/* Valor cotización */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <label className="text-gray-700 font-semibold text-sm sm:text-base w-full sm:w-auto">
              Valor cotización
            </label>
            <input
              type="number"
              placeholder="0"
              value={datos.valorCotizacion}
              onChange={(e) =>
                setDatos({ ...datos, valorCotizacion: e.target.value })
              }
              className="border p-2 rounded-md w-full sm:w-48 md:w-32 text-right focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        {/* OBSERVACIONES */}
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
            className="w-full border p-3 rounded-md focus:ring-2 focus:ring-blue-600 outline-none resize-none text-sm sm:text-base"
          />
        </div>

        {/* BOTÓN FINAL */}
        <div className="text-center md:text-right">
          <button
            onClick={handleGenerarPDF}
            className="w-full sm:w-auto px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-sm sm:text-base"
          >
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
