"use client";

import React, { useState, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { dataObjetivoEG01, dataObjetivoEG02, dataObjetivoEG03, dataObjetivoEG04, dataObjetivoEG05, dataObjetivoEG06, dataObjetivoEG07, dataObjetivoEG08, dataObjetivoEG09, dataObjetivoET01, dataObjetivoET02, dataObjetivoET03, } from '@/utils/plataformaEstrategicaData';
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
  // Para nuevas estrategias de datos estáticos
  const [nuevasEstrategias, setNuevasEstrategias] = useState({});
  // Para nuevas líneas de acción (estáticos y dinámicos unificados)
  const [nuevasLineas, setNuevasLineas] = useState({});

  // Generar IDs para datos estáticos
  const staticWithId = useMemo(() =>
    allData.map(({ id: eje, data }) => ({
      eje,
      propuestas: data.map(prop => ({
        ...prop,
        id: uuidv4(),
        Estrategias: (prop.Estrategias || []).map(estr => ({
          ...estr,
          id: uuidv4(),
          lineas: (estr['Lineas de acción'] || []).map(lin => ({ id: uuidv4(), text: lin })),
        })),
      })),
    })), []
  );

  const handleAcuerdoChange = (id, valor) => setAcuerdo(id, valor);
  const handleComentarioChange = (id, campo, valor) => setComentario(id, campo, valor);

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleGuardarAvance = () => setSnackbar({ open: true, message: '¡Avance guardado!', severity: 'info' });
  const handleGuardarComentarios = () => setSnackbar({ open: true, message: '¡Comentarios enviados!', severity: 'success' });

  // Dinámico: nuevas propuestas/estrategias/líneas
  const handleAgregarPropuesta = () => {
    const nombre = prompt('Nueva Propuesta');
    if (!nombre) return;
    setNuevoContenido(prev => ({
      propuestas: [...prev.propuestas, { id: uuidv4(), nombre, estrategias: [] }]
    }));
  };
  const handleAgregarEstrategia = propuestaId => {
    const nombre = prompt('Nueva Estrategia');
    if (!nombre) return;

    setNuevoContenido(prev => {
      const propuestas = prev.propuestas.map(p => {
        if (p.id !== propuestaId) return p;

        const idEstr = uuidv4();
        return {
          ...p,
          estrategias: [
            ...p.estrategias,
            {
              id: idEstr,
              nombre,
              lineas: []   // siempre vacías al crear la estrategia
            }
          ]
        };
      });

      return { propuestas };
    });
  };

  // Estático: proponer estrategia y línea inicial
  const handleAgregarEstrategiaStatic = propuestaId => {
    const nombre = prompt('Proponer nueva Estrategia');
    if (!nombre) return;
    setNuevasEstrategias(prev => ({
      ...prev,
      [propuestaId]: [
        ...(prev[propuestaId] || []),
        { id: uuidv4(), nombre, lineas: [] }
      ]
    }));
  };

  const handleAgregarLineaStatic = (propuestaId, estrategiaId) => {
    const text = prompt('Agregar nuevo Lineamiento');
    if (!text) return;
    setNuevasLineas(prev => {
      const byProp = prev[propuestaId] || {};
      const arr = byProp[estrategiaId] || [];
      return {
        ...prev,
        [propuestaId]: {
          ...byProp,
          [estrategiaId]: [...arr, { id: uuidv4(), text }]
        }
      };
    });
  };

  // Render helpers
  const renderLineas = (prefix, originales, propId, estrId) => {
    const extra = nuevasLineas[propId]?.[estrId] || [];
    return [...originales, ...extra].map(l => {
      const fid = `${prefix}-linea-${l.id}`;
      return (
        <li key={l.id} className={styles.lineaAccion}>
          <p>{l.text}</p>
          {/* Solo originales y estáticas usan FeedbackSection */}
          {originales.find(o => o.id === l.id) && (
            <FeedbackSection
              id={fid}
              acuerdo={feedback[fid]?.acuerdo}
              comentarios={feedback[fid]?.comentarios}
              onAcuerdoChange={handleAcuerdoChange}
              onComentarioChange={handleComentarioChange}
            />
          )}
        </li>
      );
    });
  };

  const renderEstrategias = (propId, prefix, estrategias = [], showQuestion = false) =>
    estrategias.map(estr => {
      const fid = `${prefix}-estrategia-${estr.id}`;
      const lineas = estr.lineas || [];

      return (
        <div key={estr.id} className={styles.estrategia}>
          <h4>{estr.Estrategia || estr.nombre}</h4>

          {showQuestion && (
            <FeedbackSection
              id={fid}
              acuerdo={feedback[fid]?.acuerdo}
              comentarios={feedback[fid]?.comentarios}
              onAcuerdoChange={handleAcuerdoChange}
              onComentarioChange={handleComentarioChange}
            />
          )}

          <ul>{renderLineas(fid, lineas, propId, estr.id)}</ul>

          <button
            className={styles.addButton}
            onClick={() => handleAgregarLineaStatic(propId, estr.id)}
          >
            Agregar Línea de Acción
          </button>
        </div>
      );
    });

  const PropuestaHeader = ({ p }) => (
    <h3>
      {p.nombre}
      <button
        onClick={() => {
          const nombre = prompt('Editar propuesta', p.nombre);
          if (nombre !== null) {
            setNuevoContenido(prev => ({
              ...prev,
              propuestas: prev.propuestas.map(x =>
                x.id === p.id ? { ...x, nombre } : x
              )
            }));
          }
        }}
      >
        ✏️
      </button>
      <button
        onClick={() =>
          setNuevoContenido(prev => ({
            ...prev,
            propuestas: prev.propuestas.filter(x => x.id !== p.id)
          }))
        }
      >
        ❌
      </button>
    </h3>
  );

  const PropuestaActions = ({ propId }) => (
    <>
      <button
        className={styles.addButton}
        onClick={() => handleAgregarEstrategia(propId)}
      >
        Agregar Estrategia hoal
      </button>
    </>
  );

  const renderPropuestas = (eje, propuestas) =>
    propuestas.map(prop => {
      const prefix = `${eje}-propuesta-${prop.id}`;
      const isStatic = !!prop['Propuesta Objetivo'];
      const estáticas = prop.Estrategias || [];
      const nuevas = nuevasEstrategias[prop.id] || [];
      return (
        <div key={prop.id} className={styles.propuesta}>
          <h3>{prop['Propuesta Objetivo'] || prop.nombre}</h3>

          {isStatic && (
            <FeedbackSection
              id={prefix}
              acuerdo={feedback[prefix]?.acuerdo}
              comentarios={feedback[prefix]?.comentarios}
              onAcuerdoChange={handleAcuerdoChange}
              onComentarioChange={handleComentarioChange}
            />
          )}

          {renderEstrategias(prop.id, prefix, estáticas, isStatic)}
          {renderEstrategias(prop.id, prefix, nuevas, false)}

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
        </div>
      );
    });

  const renderNuevasPropuestas = () =>
    nuevoContenido.propuestas.map(p => {
      const prefix = `${p.id}-propuesta`;

      return (
        <div key={p.id} className={styles.propuesta}>
          <PropuestaHeader p={p} />
          <PropuestaActions propId={p.id} />
          {renderEstrategias(p.id, prefix, p.estrategias, false)}
        </div>
      );
    });

  return (
    <div className={styles.container}>
      <div className={styles.containerReview}>
        <h2>
          <span className="spanDoarado">Revisión</span> de la{' '}
          <span className="spanVino">Plataforma Estratégica</span>
        </h2>

        {selectedEjes.length === 0 ? (
          <p>No hay ejes seleccionados.</p>
        ) : selectedEjes.map(eje => {
          const block = staticWithId.find(b => b.eje === eje);
          return (
            <div key={eje} className={styles.propuesta}>
              <h3 className={styles.ejeActivo}>Observación eje: {eje}</h3>
              {block?.propuestas.length
                ? renderPropuestas(eje, block.propuestas)
                : <p>No hay datos.</p>}
            </div>
          );
        })}

        {renderNuevasPropuestas()}

        <div className={styles.buttonWrapper}>
          <button className={styles.slideButton} onClick={handleAgregarPropuesta}>Agregar nueva propuesta</button>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <div className={styles.buttonsContainerfixed}>
          <div className={styles.buttonWrapper}>
            <button className={styles.slideButton} onClick={handleGuardarAvance}>Guardar avance</button>
          </div>
          <div className={styles.buttonWrapper}>
            <button className={styles.slideButton} onClick={handleGuardarComentarios}>Enviar comentarios</button>
          </div>
        </div>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
