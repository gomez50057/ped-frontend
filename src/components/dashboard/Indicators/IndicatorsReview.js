'use client';

import React, { useState } from 'react';
import * as indicators from '@/utils/indicatorsData';
import styles from './IndicatorsReview.module.css';
import FeedbackSection from '../components/FeedbackSection/IndicatorsFeedbackSection';

export default function IndicatorsReview() {
  const allIndicators = Object.values(indicators).flat();

  // Estado para el feedback por indicador
  const [feedback, setFeedback] = useState({});

  function handleAcuerdoChange(id, value) {
  setFeedback(prev => {
    // Si cambia de "no" a "sí", limpia justificación
    if (value === "yes") {
      return {
        ...prev,
        [id]: {
          ...prev[id],
          acuerdo: "yes",
          comentarios: {
            ...prev[id]?.comentarios,
            justificacion: "" // limpia justificación
          }
          // NO toques metas ni metasComentario
        }
      };
    } else if (value === "no") {
      // Si es "no", limpia metas y metasComentario
      return {
        ...prev,
        [id]: {
          ...prev[id],
          acuerdo: "no",
          metas: "",
          comentarios: {
            ...prev[id]?.comentarios,
            metasComentario: "" // limpia metasComentario
          }
        }
      };
    } else {
      // En cualquier otro caso, deja igual
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
          metasComentario: value === "no" ? "" : prev[id]?.comentarios?.metasComentario || ""
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


  return (
    <div className={styles.container}>
      {allIndicators.map((item) => {
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

            {/* --- SECCIÓN DE FEEDBACK --- */}
            <FeedbackSection
              id={fichaId}
              acuerdo={feedback[fichaId]?.acuerdo || ""}
              metas={feedback[fichaId]?.metas || ""}
              comentarios={feedback[fichaId]?.comentarios || {}}
              onAcuerdoChange={handleAcuerdoChange}
              onMetasChange={handleMetasChange}
              onComentarioChange={handleComentarioChange}
            />
          </div>
        );
      })}
    </div>
  );
}
