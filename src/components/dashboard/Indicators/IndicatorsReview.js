'use client';

import React, { useState } from 'react';
import * as indicators from '@/utils/indicatorsData';
import { EJE_GROUPS } from '@/utils/indicatorsDataGroups';
import styles from './IndicatorsReview.module.css';
import FeedbackSection from '../components/FeedbackSection/IndicatorsFeedbackSection';

export default function IndicatorsReview() {
  const [feedback, setFeedback] = useState({});
  const [isFinal, setIsFinal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  function groupIndicatorsByEje() {
    return EJE_GROUPS.map(eje => {
      const missing = eje.keys.filter(key => !indicators[key]);
      if (missing.length > 0) {
        throw new Error(`Faltan los indicadores: ${missing.join(', ')} en ${eje.title}`);
      }
      return {
        ...eje,
        indicators: eje.keys.map(key => indicators[key]),
      };
    });
  }

  function handleAcuerdoChange(id, value) {
    setFeedback(prev => {
      if (value === "yes") {
        return {
          ...prev,
          [id]: {
            ...prev[id],
            acuerdo: "yes",
            comentarios: {
              ...prev[id]?.comentarios,
              justificacion: "No Aplica",
              meta2028: "",
              meta2040: ""
            }
          }
        };
      } else if (value === "no") {
        return {
          ...prev,
          [id]: {
            ...prev[id],
            acuerdo: "no",
            metas: "",
            comentarios: {
              ...prev[id]?.comentarios,
              justificacion: "",
              meta2028: "",
              meta2040: ""
            }
          }
        };
      } else {
        return prev;
      }
    });
  }

  function handleMetasChange(id, value) {
    setFeedback(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        metas: value,
        comentarios: {
          ...prev[id]?.comentarios,
          meta2028: value === "yes" ? "No Aplica" : "",
          meta2040: value === "yes" ? "No Aplica" : ""
        }
      }
    }));
  }

  function handleComentarioChange(id, field, value) {
    setFeedback(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        comentarios: {
          ...prev[id]?.comentarios,
          [field]: value
        }
      }
    }));
  }

  function handleAgregarPropuesta(fichaId) {
    // Aquí pon la lógica que necesites (abrir modal, etc)
    alert(`Agregar propuesta para el indicador: ${fichaId}`);
  }


  const grouped = groupIndicatorsByEje(indicators);

  return (
    <div className={styles.container}>
      <div className={styles.containerReview}>
        {grouped.map(eje => (
          <div key={eje.title} className={styles.ejeContainer}>
            <h2 className={styles.ejeTitle}>{eje.title}</h2>
            {
              eje.indicators.map(item => {
                if (!item || !item.indicador || !item.indicador.id) {
                  return <div style={{ color: 'red' }}>Indicador mal definido</div>;
                }
                const fichaId = item.indicador.id;
                return (
                  <div key={fichaId} className={styles.indicatorCard}>
                    <div className={styles.header}>
                      <span className={styles.headerText}>
                        FICHA DEL INDICADOR {fichaId.replace('indicador_', '').replace(/_/g, '. ').toUpperCase()}
                      </span>
                    </div>
                    <div className={styles.contentGrid}>
                      {/* Columna Izquierda */}
                      <div className={styles.leftColumn}>
                        <div className={styles.fieldBlock}>
                          <div className={styles.labelL}>Nombre del indicador:</div>
                          <div className={styles.boldL}>{item.indicador.nombre}</div>
                        </div>

                        <div className={styles.fieldBlock}>
                          <div className={styles.labelL}>Alineación al PED 2025-2028 (Objetivo)</div>
                          <div className={styles.valueL}>
                            <span className={styles.keyObj}>
                              {item.alineacion_PED.objetivo_texto.split(' ')[0]}
                            </span>
                            {item.alineacion_PED.objetivo_texto.substring(item.alineacion_PED.objetivo_texto.indexOf(' ') + 1)}
                          </div>
                        </div>

                        <div className={styles.fieldBlock}>
                          <div className={styles.labelL}>Alineación al Plan Nacional de Desarrollo 2025 -2030 (Eje)</div>
                          <div className={styles.valueL}>
                            <span>{item.alineacion_plan_nacional.eje}</span>
                          </div>
                        </div>

                        <div className={styles.fieldBlock}>
                          <div className={styles.labelL}>Alineación a ODS:</div>
                          <div className={styles.odsContainer}>
                            {item.alineacion_ODS.ods.map((ods) => (
                              <div key={ods} className={styles.odsItem}>
                                <img
                                  src={`/img/dashboard/img-ods/S-WEB-Goal-${ods}.png`}
                                  alt={`ODS ${ods}`}
                                  className={styles.odsImg}
                                  onError={(e) => (e.target.style.display = 'none')}
                                />
                                <span className={styles.odsNumber}>{ods}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Columna Derecha */}
                      <div className={styles.rightColumn}>
                        <div className={styles.fieldBlock}>
                          <span className={styles.label}>Descripción:</span>
                          <span className={styles.value}>{item.descripcion.texto}</span>
                        </div>
                        <div className={styles.rowFields}>
                          <div>
                            <span className={styles.label}>Periodicidad:</span>
                            <span className={styles.value}>{item.periodicidad.valor}</span>
                          </div>
                          <div>
                            <span className={styles.label}>Sentido del indicador:</span>
                            <span className={styles.value}>{item.sentido_indicador.valor}</span>
                          </div>
                        </div>
                        <div className={styles.rowFields}>
                          <div>
                            <span className={styles.label}>Línea base:</span>
                            <div className={styles.value}>
                              <span className={styles.bold}>{item.linea_base.titulo}:</span> {item.linea_base.subtitulo}
                            </div>
                          </div>
                          <div>
                            <span className={styles.label}>Metas:</span>
                            <ul className={styles.goals}>
                              {item.metas.map((meta) => (
                                <li key={meta.id}>
                                  <span className={styles.bold}>{meta.titulo}:</span> {meta.subtitulo}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className={styles.fieldBlock}>
                          <span className={styles.label}>Fuente:</span>
                          <span className={styles.value}>
                            {item.fuente.organizaciones.join(', ')}
                            {item.fuente.url && (
                              <>
                                <br />
                                <a
                                  href={item.fuente.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.link}
                                >
                                  {item.fuente.url}
                                </a>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <FeedbackSection
                      id={fichaId}
                      acuerdo={feedback[fichaId]?.acuerdo || ""}
                      metas={feedback[fichaId]?.metas || ""}
                      comentarios={feedback[fichaId]?.comentarios || {}}
                      onAcuerdoChange={handleAcuerdoChange}
                      onMetasChange={handleMetasChange}
                      onComentarioChange={handleComentarioChange}
                      onAgregarPropuesta={handleAgregarPropuesta}
                    />
                  </div>
                );
              })
            }
          </div>
        ))}
      </div>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttonsContainerfixed}>
          <div className={styles.buttonWrapper}>
            <button
              type="button"
              className={styles.slideButton}
              onClick={() => {
                console.log({
                  feedback,
                  envioFinal: isFinal,
                });
                setSnackbar({ open: true, message: "Avance guardado en consola", severity: "info" });
              }}
            >
              Guardar avance
            </button>
          </div>
          <div className={styles.envioFinalWrapper}>
            <label className={styles.containerChecked}>
              <input
                type="checkbox"
                checked={isFinal}
                onChange={e => setIsFinal(e.target.checked)}
              />
              <div className={styles.checkmark}>
                <svg
                  className={styles.checkboxSvg}
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    className={styles.checkboxCircle}
                    strokeWidth="20"
                  />
                  <path
                    className={styles.checkboxTick}
                    d="M52 111.018L76.9867 136L149 64"
                    strokeWidth="15"
                  ></path>
                </svg>
              </div>
              <p className={styles.checkboxLabel}>
                Confirmo que estas son mis aportaciones finales. <br />
                (<b>Aún puedes modificar hasta la fecha límite</b>)
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
