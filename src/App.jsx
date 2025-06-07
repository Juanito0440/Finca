import React, { useEffect, useState } from "react";
import {
  getRecolectores,
  createRecolector,
  createRecoleccion,
  getRecolecciones,
  updateRecoleccion,
} from "./services/api";

import "./css/style.css";

function App() {
  const [recolectores, setRecolectores] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [recolecciones, setRecolecciones] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [recolectorSeleccionado, setRecolectorSeleccionado] = useState(null);

  useEffect(() => {
    getRecolectores().then((res) => setRecolectores(res.data));
  }, []);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");

  const handleNuevoRecolector = async () => {
    try {
      const res = await fetch("http://localhost:3001/recolectores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          telefono: nuevoTelefono,
        }),
      });

      const data = await res.json();
      alert("Recolector registrado correctamente ✅");

      // Recargar lista
      setRecolectores([
        ...recolectores,
        { id: data.id, nombre: nuevoNombre, telefono: nuevoTelefono },
      ]);
      setNuevoNombre("");
      setNuevoTelefono("");
    } catch (error) {
      console.error("Error al registrar recolector", error);
      alert("❌ Error al registrar recolector");
    }
  };

  const handleAgregarRecoleccion = async (id) => {
    await createRecoleccion({ recolector_id: id, cantidad });
    const res = await getRecolecciones(id);
    setRecolecciones(res.data);
  };

  const handleVerRecolecciones = async (id) => {
    setSelectedId(id);
    const res = await getRecolecciones(id);
    setRecolecciones(res.data);
  };

  const handleEditar = async (id, nuevaCantidad) => {
    await updateRecoleccion(id, { cantidad: nuevaCantidad });
    const res = await getRecolecciones(selectedId);
    setRecolecciones(res.data);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Finca La Esmeralda</h1>
        <p className="fecha-actual">
          Fecha actual: {new Date().toLocaleString()}
        </p>
      </div>

      <h2>Registrar Nuevo Recolector</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNuevoRecolector();
        }}
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={nuevoTelefono}
          onChange={(e) => setNuevoTelefono(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>

      <h2>Recolectores</h2>
      {recolectores.map((r) => (
        <div key={r.id} className="recolector-card">
          <div className="recolector-info">
            <strong>{r.nombre}</strong>
            <div className="recolector-telefono">{r.telefono}</div>

            {recolectorSeleccionado === r.id && (
              <div className="form-recoleccion">
                <input
                  type="number"
                  placeholder="Cantidad (kg)"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleAgregarRecoleccion(r.id);
                    setCantidad("");
                    setRecolectorSeleccionado(null);
                  }}
                >
                  Guardar
                </button>
              </div>
            )}
          </div>

          <div className="recolector-actions">
            <button
              className="btn btn-primary"
              onClick={() => setRecolectorSeleccionado(r.id)}
            >
              Agregar Recolección
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleVerRecolecciones(r.id)}
            >
              Ver Recolecciones
            </button>
          </div>
        </div>
      ))}

      {selectedId && (
        <>
          <h3>Recolecciones</h3>
          <div className="recoleccion-list">
            {recolecciones.map((rec) => (
              <div key={rec.id} className="recoleccion-item">
                <span>
                  {rec.fecha} - {rec.cantidad} kg
                </span>
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    const nuevaCantidad = prompt(
                      "Editar cantidad:",
                      rec.cantidad
                    );
                    if (nuevaCantidad) handleEditar(rec.id, nuevaCantidad);
                  }}
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export default App;
