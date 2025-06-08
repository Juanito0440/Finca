import React, { useEffect, useState } from "react";
import {
  getRecolectores,
  createRecolector,
  createRecoleccion,
  getRecolecciones,
  updateRecoleccion,
  deleteRecolector
} from "./services/api";
import TotalesCalculos from "./components/TotalesCalculos";
import {
  Trash2,
  Plus,
  Eye,
  Edit,
  User,
  Phone,
  Calendar,
  Weight,
} from "lucide-react";
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

  const handleEliminarRecolector = async (id, nombre) => {
    const confirmacion = window.confirm(
      `¿Estás seguro de que deseas eliminar al recolector "${nombre}"?\n\nEsta acción no se puede deshacer y eliminará todas sus recolecciones asociadas.`
    );

    if (!confirmacion) return;

    try {
      setLoading(true);
      setError("");

      // Aquí debes agregar tu servicio de eliminación
      await deleteRecolector(id);

      // Actualizar la lista local eliminando el recolector
      setRecolectores((prev) => prev.filter((r) => r.id !== id));

      // Si estamos viendo las recolecciones de este recolector, limpiar la vista
      if (selectedId === id) {
        setSelectedId(null);
        setRecolecciones([]);
      }

      alert("Recolector eliminado correctamente ✅");
    } catch (error) {
      console.error("Error al eliminar recolector:", error);
      setError("Error al eliminar recolector");
      alert("❌ Error al eliminar recolector");
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
          className={`nav-tab ${
            vistaActual === "recolectores" ? "active" : ""
          }`}
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
      {error && <div className="error-message">{error}</div>}

      {/* Indicador de carga */}
      {loading && vistaActual === "recolectores" && (
        <div className="loading">Cargando...</div>
      )}

      {/* Vista de gestión de recolectores */}
      {vistaActual === "recolectores" && (
        <>
          <div className="form-section">
            <h2>➕ Registrar Nuevo Recolector</h2>
            <div className="nuevo-recolector-form">
              <div className="input-group">
                <div className="input-with-icon">
                  <User className="input-icon" />
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="input-with-icon">
                  <Phone className="input-icon" />
                  <input
                    type="text"
                    placeholder="Número de teléfono"
                    value={nuevoTelefono}
                    onChange={(e) => setNuevoTelefono(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleNuevoRecolector}
                disabled={loading}
                className="btn-submit"
              >
                <Plus size={16} />
                {loading ? "Registrando..." : "Registrar Recolector"}
              </button>
            </div>
          </div>
          
          <div className="recolectores-section">
            <h2>👥 Lista de Recolectores ({recolectores.length})</h2>
            {recolectores.length === 0 ? (
              <div className="no-datos">
                <User size={48} className="no-datos-icon" />
                <p>No hay recolectores registrados</p>
                <p className="no-datos-subtitle">
                  Agrega tu primer recolector usando el formulario de arriba
                </p>
              </div>
            ) : (
              <div className="recolectores-grid">
                {recolectores.map((r) => (
                  <div key={r.id} className="recolector-card-modern">
                    <div className="recolector-header">
                      <div className="recolector-avatar">
                        <User size={24} />
                      </div>
                      <div className="recolector-info">
                        <h3 className="recolector-nombre">{r.nombre}</h3>
                        <div className="recolector-telefono">
                          <Phone size={14} />
                          {r.telefono}
                        </div>
                      </div>
                    </div>

                    {recolectorSeleccionado === r.id && (
                      <div className="form-recoleccion-modern">
                        <div className="recoleccion-input-group">
                          <Weight className="input-icon-small" />
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Cantidad en kg"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            disabled={loading}
                            className="cantidad-input"
                          />
                          <div className="recoleccion-actions">
                            <button
                              className="btn btn-success-small"
                              onClick={() => handleAgregarRecoleccion(r.id)}
                              disabled={loading || !cantidad}
                              title="Guardar recolección"
                            >
                              ✓
                            </button>
                            <button
                              className="btn btn-cancel-small"
                              onClick={() => {
                                setRecolectorSeleccionado(null);
                                setCantidad("");
                              }}
                              disabled={loading}
                              title="Cancelar"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="recolector-actions">
                      <button
                        className="btn btn-primary-icon"
                        onClick={() => {
                          if (recolectorSeleccionado === r.id) {
                            setRecolectorSeleccionado(null);
                            setCantidad("");
                          } else {
                            setRecolectorSeleccionado(r.id);
                            setCantidad("");
                          }
                        }}
                        disabled={loading}
                        title="Agregar recolección"
                      >
                        <Plus size={16} />
                        Agregar
                      </button>
                      <button
                        className="btn btn-secondary-icon"
                        onClick={() => handleVerRecolecciones(r.id)}
                        disabled={loading}
                        title="Ver recolecciones"
                      >
                        <Eye size={16} />
                        Ver
                      </button>
                      <button
                        className="btn btn-danger-icon"
                        onClick={() => handleEliminarRecolector(r.id, r.nombre)}
                        disabled={loading}
                        title="Eliminar recolector"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedId && (
            <div className="recolecciones-section">
              <div className="recolecciones-header">
                <h3>
                  📊 Recolecciones de{" "}
                  {recolectores.find((r) => r.id === selectedId)?.nombre}
                </h3>
                <button
                  className="btn btn-close"
                  onClick={() => {
                    setSelectedId(null);
                    setRecolecciones([]);
                  }}
                  title="Cerrar vista de recolecciones"
                >
                  ✕
                </button>
              </div>

              {recolecciones.length === 0 ? (
                <div className="no-datos">
                  <Calendar size={48} className="no-datos-icon" />
                  <p>No hay recolecciones registradas</p>
                  <p className="no-datos-subtitle">
                    Las recolecciones aparecerán aquí una vez que las agregues
                  </p>
                </div>
              ) : (
                <div className="recoleccion-list-modern">
                  {recolecciones.map((rec, index) => (
                    <div key={rec.id} className="recoleccion-item-modern">
                      <div className="recoleccion-numero">#{index + 1}</div>
                      <div className="recoleccion-info">
                        <div className="recoleccion-fecha">
                          <Calendar size={16} />
                          {rec.fecha}
                        </div>
                        <div className="recoleccion-cantidad">
                          <Weight size={16} />
                          <strong>{rec.cantidad} kg</strong>
                        </div>
                      </div>
                      <button
                        className="btn btn-edit-icon"
                        onClick={() => {
                          const nuevaCantidad = prompt(
                            `Editar cantidad para ${rec.fecha}:`,
                            rec.cantidad
                          );
                          if (
                            nuevaCantidad &&
                            nuevaCantidad !== rec.cantidad.toString()
                          ) {
                            handleEditar(rec.id, parseFloat(nuevaCantidad));
                          }
                        }}
                        disabled={loading}
                        title="Editar cantidad"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  ))}

                  <div className="recolecciones-resumen">
                    <div className="resumen-item">
                      <span>Total de recolecciones:</span>
                      <strong>{recolecciones.length}</strong>
                    </div>
                    <div className="resumen-item">
                      <span>Cantidad total:</span>
                      <strong>
                        {recolecciones
                          .reduce(
                            (sum, rec) => sum + parseFloat(rec.cantidad),
                            0
                          )
                          .toFixed(1)}{" "}
                        kg
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Vista de totales y cálculos */}
      {vistaActual === "totales" && <TotalesCalculos />}
    </div>
  );
}

export default App;
