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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cargar recolectores al montar el componente
  useEffect(() => {
    const cargarRecolectores = async () => {
      try {
        setLoading(true);
        const res = await getRecolectores();
        setRecolectores(res.data);
        setError("");
      } catch (error) {
        console.error("Error al cargar recolectores:", error);
        setError("Error al cargar los recolectores");
      } finally {
        setLoading(false);
      }
    };

    cargarRecolectores();
  }, []);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");

  const handleNuevoRecolector = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Usar la función del servicio API en lugar de fetch directo
      const res = await createRecolector({
        nombre: nuevoNombre,
        telefono: nuevoTelefono,
      });

      alert("Recolector registrado correctamente ✅");

      // Recargar lista
      setRecolectores([
        ...recolectores,
        { id: res.data.id, nombre: nuevoNombre, telefono: nuevoTelefono },
      ]);
      setNuevoNombre("");
      setNuevoTelefono("");
    } catch (error) {
      console.error("Error al registrar recolector:", error);
      setError("Error al registrar recolector");
      alert("❌ Error al registrar recolector");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarRecoleccion = async (id) => {
    try {
      setLoading(true);
      setError("");
      
      await createRecoleccion({ recolector_id: id, cantidad });
      const res = await getRecolecciones(id);
      setRecolecciones(res.data);
      
      alert("Recolección agregada correctamente ✅");
    } catch (error) {
      console.error("Error al agregar recolección:", error);
      setError("Error al agregar recolección");
      alert("❌ Error al agregar recolección");
    } finally {
      setLoading(false);
    }
  };

  const handleVerRecolecciones = async (id) => {
    try {
      setLoading(true);
      setError("");
      
      setSelectedId(id);
      const res = await getRecolecciones(id);
      setRecolecciones(res.data);
    } catch (error) {
      console.error("Error al cargar recolecciones:", error);
      setError("Error al cargar recolecciones");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = async (id, nuevaCantidad) => {
    try {
      setLoading(true);
      setError("");
      
      await updateRecoleccion(id, { cantidad: nuevaCantidad });
      const res = await getRecolecciones(selectedId);
      setRecolecciones(res.data);
      
      alert("Recolección actualizada correctamente ✅");
    } catch (error) {
      console.error("Error al editar recolección:", error);
      setError("Error al editar recolección");
      alert("❌ Error al editar recolección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Finca La Esmeralda</h1>
        <p className="fecha-actual">
          Fecha actual: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Mostrar errores si existen */}
      {error && (
        <div className="error-message" style={{ 
          color: 'red', 
          background: '#ffebee', 
          padding: '10px', 
          borderRadius: '4px',
          margin: '10px 0'
        }}>
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="loading" style={{ 
          textAlign: 'center', 
          padding: '10px',
          color: '#666'
        }}>
          Cargando...
        </div>
      )}

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
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={nuevoTelefono}
          onChange={(e) => setNuevoTelefono(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
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
                  disabled={loading}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleAgregarRecoleccion(r.id);
                    setCantidad("");
                    setRecolectorSeleccionado(null);
                  }}
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            )}
          </div>

          <div className="recolector-actions">
            <button
              className="btn btn-primary"
              onClick={() => setRecolectorSeleccionado(r.id)}
              disabled={loading}
            >
              Agregar Recolección
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleVerRecolecciones(r.id)}
              disabled={loading}
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
                  disabled={loading}
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