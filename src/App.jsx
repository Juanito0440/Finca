import React, { useEffect, useState } from "react";
import {
  getRecolectores,
  createRecolector,
  createRecoleccion,
  getRecolecciones,
  updateRecoleccion,
} from "./services/api";
import TotalesCalculos from "./components/TotalesCalculos";

import "./css/style.css";

function App() {
  const [recolectores, setRecolectores] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [recolecciones, setRecolecciones] = useState([]);
  const [cantidad, setCantidad] = useState("");
  const [recolectorSeleccionado, setRecolectorSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vistaActual, setVistaActual] = useState("recolectores"); // "recolectores" o "totales"

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

    if (vistaActual === "recolectores") {
      cargarRecolectores();
    }
  }, [vistaActual]);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTelefono, setNuevoTelefono] = useState("");

  const handleNuevoRecolector = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await createRecolector({
        nombre: nuevoNombre,
        telefono: nuevoTelefono,
      });

      alert("Recolector registrado correctamente ✅");

      // Recargar toda la lista de recolectores desde el servidor
      const recolectoresActualizados = await getRecolectores();
      setRecolectores(recolectoresActualizados.data);
      
      // Limpiar el formulario
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
        <h1>🌿 Finca La Esmeralda</h1>
        <p className="fecha-actual">
          Fecha actual: {new Date().toLocaleString()}
        </p>
      </div>

      {/* Navegación entre vistas */}
      <div className="navigation-tabs">
        <button 
          className={`nav-tab ${vistaActual === "recolectores" ? "active" : ""}`}
          onClick={() => setVistaActual("recolectores")}
        >
          👥 Gestión de Recolectores
        </button>
        <button 
          className={`nav-tab ${vistaActual === "totales" ? "active" : ""}`}
          onClick={() => setVistaActual("totales")}
        >
          📊 Totales y Pagos
        </button>
      </div>

      {/* Mostrar errores si existen */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && vistaActual === "recolectores" && (
        <div className="loading">
          Cargando...
        </div>
      )}

      {/* Vista de gestión de recolectores */}
      {vistaActual === "recolectores" && (
        <>
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
                      step="0.1"
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
                      {rec.fecha} - <strong>{rec.cantidad} kg</strong>
                    </span>
                    <button
                      className="btn btn-warning"
                      onClick={() => {
                        const nuevaCantidad = prompt(
                          "Editar cantidad:",
                          rec.cantidad
                        );
                        if (nuevaCantidad && nuevaCantidad !== rec.cantidad) {
                          handleEditar(rec.id, nuevaCantidad);
                        }
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
        </>
      )}

      {/* Vista de totales y cálculos */}
      {vistaActual === "totales" && <TotalesCalculos />}
    </div>
  );
}

export default App;