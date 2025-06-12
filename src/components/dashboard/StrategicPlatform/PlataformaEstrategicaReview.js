"use client";

import React, { useState, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {  dataObjetivoEG01,  dataObjetivoEG02,  dataObjetivoEG03,  dataObjetivoEG04,  dataObjetivoEG05,  dataObjetivoEG06,  dataObjetivoEG07,  dataObjetivoEG08,  dataObjetivoEG09,  dataObjetivoET01,  dataObjetivoET02,  dataObjetivoET03,} from '@/utils/plataformaEstrategicaData';
import { usePlatform } from '@/context/PlatformContext';
import { useFeedback } from '@/hooks/useFeedback';
import { v4 as uuidv4 } from 'uuid';
import styles from './PlataformaEstrategicaReview.module.css';
import FeedbackSection from '../components/FeedbackSection/FeedbackSection';

const allData = [
  { id: 'EG01', data: dataObjetivoEG01 },
  { id: 'EG02', data: dataObjetivoEG02 },
  { id: 'EG03', data: dataObjetivoEG03 },
  { id: 'EG04', data: dataObjetivoEG04 },
  { id: 'EG05', data: dataObjetivoEG05 },
  { id: 'EG06', data: dataObjetivoEG06 },
  { id: 'EG07', data: dataObjetivoEG07 },
  { id: 'EG08', data: dataObjetivoEG08 },
  { id: 'EG09', data: dataObjetivoEG09 },
  { id: 'ET01', data: dataObjetivoET01 },
  { id: 'ET02', data: dataObjetivoET02 },
  { id: 'ET03', data: dataObjetivoET03 },
];

export default function PlataformaEstrategicaReview() {
  const { selectedEjes } = usePlatform();
  const { feedback, setAcuerdo, setComentario } = useFeedback();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [nuevoContenido, setNuevoContenido] = useState({ propuestas: [] });
  const [nuevasEstrategias, setNuevasEstrategias] = useState({});

  // Genera IDs únicos para los bloques estáticos
  const staticWithId = useMemo(
    () =>
      allData.map(({ id: eje, data }) => ({
        eje,
        propuestas: data.map((prop) => ({
          ...prop,
          id: uuidv4(),
          Estrategias: (prop.Estrategias || []).map((estr) => ({
            ...estr,
            id: uuidv4(),
            lineas: (estr['Lineas de acción'] || []).map((lin) => ({
              id: uuidv4(),
              text: lin,
            })),
          })),
        })),
      })),
    []
  );

  // -------------------
  // Handlers de estado
  // -------------------
  const handleAcuerdoChange = (id, valor) => setAcuerdo(id, valor);
  const handleComentarioChange = (id, campo, valor) => setComentario(id, campo, valor);

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const handleGuardarAvance = () =>
    setSnackbar({ open: true, message: '¡Avance guardado con éxito!', severity: 'info' });
  const handleGuardarComentarios = () =>
    setSnackbar({ open: true, message: '¡Comentarios enviados con éxito!', severity: 'success' });

  // -----------------------------------
  // Dinámico: nuevas propuestas/estrategias/líneas
  // -----------------------------------
  const handleAgregarPropuesta = () => {
    const nueva = prompt('Nueva Propuesta Objetivo');
    if (nueva) {
      setNuevoContenido((prev) => ({
        propuestas: [...prev.propuestas, { id: uuidv4(), nombre: nueva, estrategias: [] }],
      }));
    }
  };
  const handleAgregarEstrategia = (propuestaId) => {
    const nueva = prompt('Nueva Estrategia');
    if (nueva) {
      setNuevoContenido((prev) => ({
        propuestas: prev.propuestas.map((p) =>
          p.id === propuestaId
            ? { ...p, estrategias: [...p.estrategias, { id: uuidv4(), nombre: nueva, lineas: [] }] }
            : p
        ),
      }));
    }
  };
  const handleAgregarLinea = (propuestaId, estrategiaId) => {
    const nueva = prompt('Nueva Línea de Acción');
    if (nueva) {
      setNuevoContenido((prev) => ({
        propuestas: prev.propuestas.map((p) =>
          p.id === propuestaId
            ? {
              ...p,
              estrategias: p.estrategias.map((e) =>
                e.id === estrategiaId
                  ? { ...e, lineas: [...e.lineas, { id: uuidv4(), text: nueva }] }
                  : e
              ),
            }
            : p
        ),
      }));
    }
  };

  // -------------------------------------------------
  // Estático: proponer nuevas estrategias/líneas
  // -------------------------------------------------
  const handleAgregarEstrategiaStatic = (propuestaId) => {
    const nombre = prompt('Proponer nueva Estrategia para este objetivo');
    if (nombre) {
      setNuevasEstrategias((prev) => ({
        ...prev,
        [propuestaId]: [
          ...(prev[propuestaId] || []),
          { id: uuidv4(), nombre, lineas: [] },
        ],
      }));
    }
  };
  const handleAgregarLineaStatic = (propuestaId, estrategiaId) => {
    const text = prompt('Agregar nuevo lineamiento para esta estrategia');
    if (text) {
      setNuevasEstrategias((prev) => {
        const arr = prev[propuestaId] || [];
        const updated = arr.map((e) =>
          e.id === estrategiaId
            ? { ...e, lineas: [...e.lineas, { id: uuidv4(), text }] }
            : e
        );
        return { ...prev, [propuestaId]: updated };
      });
    }
  };

  // ----------------------
  // Renders auxiliares
  // ----------------------
  const renderLineasAccion = (prefix, lineas) =>
    lineas.map((l) => {
      const fid = `${prefix}-linea-${l.id}`;
      return (
        <li key={l.id} className={styles.lineaAccion}>
          <p>{l.text}</p>
          <FeedbackSection
            id={fid}
            acuerdo={feedback[fid]?.acuerdo}
            comentarios={feedback[fid]?.comentarios}
            onAcuerdoChange={handleAcuerdoChange}
            onComentarioChange={handleComentarioChange}
          />
        </li>
      );
    });

  // Aquí acondicionamos FeedbackSection solo si isStatic===true
  const renderEstrategias = (propuestaId, prefix, arr, isStatic) =>
    arr.map((estr) => {
      const fid = `${prefix}-estrategia-${estr.id}`;
      return (
        <div key={estr.id} className={styles.estrategia}>
          <h4>{estr.Estrategia || estr.nombre}</h4>

          {isStatic && (
            <FeedbackSection
              id={fid}
              acuerdo={feedback[fid]?.acuerdo}
              comentarios={feedback[fid]?.comentarios}
              onAcuerdoChange={handleAcuerdoChange}
              onComentarioChange={handleComentarioChange}
            />
          )}

          <button
            className={styles.addButton}
            onClick={() =>
              isStatic
                ? handleAgregarLineaStatic(propuestaId, estr.id)
                : handleAgregarLinea(propuestaId, estr.id)
            }
          >
            Agregar Línea de Acción
          </button>

          <ul>{renderLineasAccion(fid, estr.lineas)}</ul>
        </div>
      );
    });

  const renderPropuestas = (ejeId, propuestas) =>
    propuestas.map((prop) => {
      const prefix = `${ejeId}-propuesta-${prop.id}`;
      const isStatic = !!prop['Propuesta Objetivo'];
      return (
        <div key={prop.id} className={styles.propuesta}>
          <h3>{prop['Propuesta Objetivo'] || prop.nombre}</h3>

          <FeedbackSection
            id={prefix}
            acuerdo={feedback[prefix]?.acuerdo}
            comentarios={feedback[prefix]?.comentarios}
            onAcuerdoChange={handleAcuerdoChange}
            onComentarioChange={handleComentarioChange}
          />

          <button
            className={styles.addButton}
            onClick={() =>
              isStatic
                ? handleAgregarEstrategiaStatic(prop.id)
                : handleAgregarEstrategia(prop.id)
            }
          >
            {isStatic ? 'Proponer Estrategia' : 'Agregar Estrategia'}
          </button>

          {renderEstrategias(prop.id, prefix, prop.Estrategias || [], true)}

          {(nuevasEstrategias[prop.id] || []).map((nestr) =>
            renderEstrategias(prop.id, prefix, [nestr], true)
          )}
        </div>
      );
    });

  const renderNuevasPropuestas = () => nuevoContenido.propuestas.map(p => (
    <div key={p.id} className={styles.propuesta}>
      <h3>
        {p.nombre}
        <button onClick={() => {
          const nuevo = prompt("Editar propuesta", p.nombre);
          if (nuevo !== null) setNuevoContenido(prev => ({ ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? { ...item, nombre: nuevo } : item) }));
        }}>✏️</button>
        <button onClick={() => setNuevoContenido(prev => ({ ...prev, propuestas: prev.propuestas.filter(item => item.id !== p.id) }))}>❌</button>
      </h3>
      <button onClick={() => handleAgregarEstrategia(p.id)}>Agregar Estrategia</button>
      {p.estrategias.map(e => (
        <div key={e.id} className={styles.estrategia}>
          <h4>
            {e.nombre}
            <button onClick={() => {
              const nuevo = prompt("Editar estrategia", e.nombre);
              if (nuevo !== null) setNuevoContenido(prev => ({
                ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? {
                  ...item, estrategias: item.estrategias.map(et => et.id === e.id ? { ...et, nombre: nuevo } : et)
                } : item)
              }));
            }}>✏️</button>
            <button onClick={() => setNuevoContenido(prev => ({
              ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? {
                ...item, estrategias: item.estrategias.filter(et => et.id !== e.id)
              } : item)
            }))}>❌</button>
          </h4>
          <button onClick={() => handleAgregarLinea(p.id, e.id)}>Agregar Línea de Acción</button>
          <ul>
            {e.lineas.map(l => (
              <li key={l.id} className={styles.lineaAccion}>
                {l.text}
                <button onClick={() => {
                  const nuevo = prompt("Editar línea", l.text);
                  if (nuevo !== null) setNuevoContenido(prev => ({
                    ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? {
                      ...item, estrategias: item.estrategias.map(et => et.id === e.id ? {
                        ...et, lineas: et.lineas.map(li => li.id === l.id ? { ...li, text: nuevo } : li)
                      } : et)
                    } : item)
                  }));
                }}>✏️</button>
                <button onClick={() => setNuevoContenido(prev => ({
                  ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? {
                    ...item, estrategias: item.estrategias.map(et => et.id === e.id ? {
                      ...et, lineas: et.lineas.filter(li => li.id !== l.id)
                    } : et)
                  } : item)
                }))}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ));

  return (
    <div className={styles.container}>
            <div className={styles.containerReview}>

      <h2><span className='spanDoarado'>Revisión</span> de la <span className='spanVino'>Plataforma Estratégica</span></h2>
      {selectedEjes.length === 0
        ? <p>No hay ejes seleccionados para revisión.</p>
        : selectedEjes.map(eje => {
          const block = staticWithId.find(b => b.eje === eje);
          return (
            <div key={eje} className={styles.propuesta}>
              <h3 className={styles.ejeActivo}>Observación de eje a revisar: {eje}</h3>
              {block?.propuestas.length ? renderPropuestas(eje, block.propuestas) : <p>No hay datos disponibles para este eje.</p>}
            </div>
          );
        })
      }
        {renderNuevasPropuestas()}
      </div>
      <div className={styles.buttonsContainer}>
        <button onClick={handleGuardarAvance} className={styles.saveButton}>Guardar avance</button>
        <button onClick={handleAgregarPropuesta} className={styles.saveButton}>Agregar nueva propuesta</button>
        <button onClick={handleGuardarComentarios} className={styles.saveButton}>Enviar comentarios</button>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
