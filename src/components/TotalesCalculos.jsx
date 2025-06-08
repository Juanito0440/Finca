import React, { useState, useEffect } from 'react';
import { getRecolectoresTotales, getResumenGeneral } from '../services/api';
import '../css/totalesCalculos.css'; 

const TotalesCalculos = () => {
  const [recolectoresTotales, setRecolectoresTotales] = useState([]);
  const [resumenGeneral, setResumenGeneral] = useState(null);
  const [precioKilo, setPrecioKilo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [totalesRes, resumenRes] = await Promise.all([
        getRecolectoresTotales(),
        getResumenGeneral()
      ]);
      
      setRecolectoresTotales(totalesRes.data);
      setResumenGeneral(resumenRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const calcularValorTotal = (totalKg) => {
    if (!precioKilo || precioKilo <= 0) return 0;
    return (parseFloat(totalKg) * parseFloat(precioKilo)).toFixed(2);
  };

  const calcularValorTotalGeneral = () => {
    if (!resumenGeneral || !precioKilo || precioKilo <= 0) return 0;
    return (parseFloat(resumenGeneral.total_general_kg) * parseFloat(precioKilo)).toFixed(2);
  };

  const formatearNumero = (numero) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(numero);
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="totales-container">
      <div className="header-totales">
        <h2>📊 Resumen de Recolecciones y Pagos</h2>
        <button 
          onClick={cargarDatos}
          className="btn btn-secondary"
          disabled={loading}
        >
          🔄 Actualizar Datos
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Configuración de precio */}
      <div className="precio-config">
        <h3>💰 Configurar Precio por Kilogramo</h3>
        <div className="precio-input-group">
          <label htmlFor="precio">Precio por kg ($):</label>
          <input
            id="precio"
            type="number"
            step="0.01"
            min="0"
            value={precioKilo}
            onChange={(e) => setPrecioKilo(e.target.value)}
            placeholder="Ej: 2500"
            className="precio-input"
          />
        </div>
      </div>

      {/* Resumen general */}
      {resumenGeneral && (
        <div className="resumen-general">
          <h3>📈 Resumen General</h3>
          <div className="resumen-cards">
            <div className="resumen-card">
              <span className="resumen-label">Total Recolectores:</span>
              <span className="resumen-value">{resumenGeneral.total_recolectores}</span>
            </div>
            <div className="resumen-card">
              <span className="resumen-label">Total Recolecciones:</span>
              <span className="resumen-value">{resumenGeneral.total_recolecciones}</span>
            </div>
            <div className="resumen-card">
              <span className="resumen-label">Total Kilogramos:</span>
              <span className="resumen-value">{resumenGeneral.total_general_kg} kg</span>
            </div>
            <div className="resumen-card total-pagar">
              <span className="resumen-label">Total a Pagar:</span>
              <span className="resumen-value">
                {formatearNumero(calcularValorTotalGeneral())}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de recolectores */}
      <div className="tabla-totales">
        <h3>👥 Totales por Recolector</h3>
        <div className="tabla-responsive">
          <table className="tabla-recolectores">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Recolecciones</th>
                <th>Total (kg)</th>
                <th>Valor a Pagar</th>
              </tr>
            </thead>
            <tbody>
              {recolectoresTotales.map((recolector) => (
                <tr key={recolector.id}>
                  <td className="nombre-recolector">
                    <strong>{recolector.nombre}</strong>
                  </td>
                  <td>{recolector.telefono}</td>
                  <td className="center">
                    <span className="badge">{recolector.num_recolecciones}</span>
                  </td>
                  <td className="center">
                    <strong>{recolector.total_recolectado} kg</strong>
                  </td>
                  <td className="valor-pagar">
                    {precioKilo ? (
                      <strong className="precio-calculado">
                        {formatearNumero(calcularValorTotal(recolector.total_recolectado))}
                      </strong>
                    ) : (
                      <span className="sin-precio">Ingrese precio</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {recolectoresTotales.length === 0 && !loading && (
        <div className="no-datos">
          <p>No hay recolectores registrados</p>
        </div>
      )}
    </div>
  );
};

export default TotalesCalculos;