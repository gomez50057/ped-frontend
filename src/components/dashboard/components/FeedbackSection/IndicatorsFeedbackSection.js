import React, { useState } from "react";
import styles from "./IndicatorsFeedbackSection.module.css";
import NewIndicatorProposalForm from "../NewIndicatorProposalForm/NewIndicatorProposalForm";
import { fetchWithAuth } from '@/utils/auth';

export default function IndicatorsFeedbackSection({
  id,
  acuerdo,
  metas,
  comentarios,
  onAcuerdoChange,
  onMetasChange,
  onComentarioChange,
  indicadorInfo,
}) {
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [indicadorIdSeleccionado, setIndicadorIdSeleccionado] = useState(null);
  const [proposalIdToEdit, setProposalIdToEdit] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  function formatPropuestaForAPI(propuesta) {
    return {
      indicator_name: propuesta.indicatorName,
      ped_alignment: propuesta.pedAlignment,
      national_plan_alignment: propuesta.nationalPlanAlignment,
      ods_alignment: propuesta.odsAlignment,
      description: propuesta.description,
      periodicity: propuesta.periodicity,
      trend: propuesta.trend,
      baseline: propuesta.baseline,
      goal_2028: propuesta.goal2028,
      goal_2040: propuesta.goal2040,
      sources: propuesta.sources,
      indicador: propuesta.indicador,
    };
  }

  async function handleSubmitPropuesta(propuesta) {
    const body = formatPropuestaForAPI(propuesta);

    try {
      const res = await fetchWithAuth('/api/indicador/new-indicador/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Propuesta enviada correctamente:", data);
        // Notifica éxito al usuario (puedes usar snackbar, etc)
      } else {
        const errorData = await res.json();
        console.error("Error al enviar la propuesta:", errorData);
        // Notifica error al usuario
      }
    } catch (error) {
      console.error("Error de red al enviar la propuesta:", error);
      // Notifica error al usuario
    }
    setShowProposalForm(false);
  }

  async function handleEditProposal(indicadorId) {
    setLoadingEdit(true);
    try {
      const res = await fetchWithAuth(`/api/indicador/new-indicador/${indicadorId}/`);
      if (res.ok) {
        const data = await res.json();
        setProposalIdToEdit(data.id); // Usar el id de la propuesta existente
        setIndicadorIdSeleccionado(indicadorId);
        setShowProposalForm(true);
      } else {
        // No existe propuesta
        alert("No existe una propuesta para este indicador.");
      }
    } catch (error) {
      alert("Error al buscar la propuesta.");
    } finally {
      setLoadingEdit(false);
    }
  }

  return (
    <div className={styles.feedbackSection}>
      {/* Pregunta sobre la estructura */}
      <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            className={styles.radioInput}
            name={`${id}-acuerdo`}
            value="yes"
            checked={acuerdo === "yes"}
            onChange={() => onAcuerdoChange(id, "yes")}
          />{" "}
          Sí
        </label>
        <label className={styles.radioSpacing}>
          <input
            type="radio"
            className={styles.radioInput}
            name={`${id}-acuerdo`}
            value="no"
            checked={acuerdo === "no"}
            onChange={() => onAcuerdoChange(id, "no")}
          />{" "}
          No
        </label>
      </div>

      {/* Si respondió "no", pedir justificación */}
      {acuerdo === "no" && (
        <>
          <div className={styles.commentArea}>
            <textarea
              placeholder="Justificación..."
              value={comentarios?.justificacion === "No Aplica" ? "" : (comentarios?.justificacion || "")}
              onChange={e =>
                onComentarioChange(id, "justificacion", e.target.value)
              }
            />
          </div>
          <span>{indicadorInfo?.nombre || "Indicador sin nombre"}</span>
          <button onClick={() => {
            setProposalIdToEdit(null);
            setShowProposalForm(true);
            setIndicadorIdSeleccionado(idDelIndicadorNuevo);
          }}>Nueva propuesta</button>



          <div>
            <button
              onClick={() => handleEditProposal(id)}
              disabled={loadingEdit}
            >
              Editar propuesta
            </button>

            {showProposalForm && (
              <NewIndicatorProposalForm
                onClose={() => setShowProposalForm(false)}
                indicadorId={indicadorIdSeleccionado}
                proposalId={proposalIdToEdit}
                onSubmit={handleSubmitPropuesta}
              />
            )}
          </div>

          {/* // Al abrir el modal: */}
          {showProposalForm && (
            <NewIndicatorProposalForm
              onClose={() => setShowProposalForm(false)}
              indicadorId={indicadorIdSeleccionado}
              proposalId={proposalIdToEdit}      // <---- IMPORTANTE
              onSubmit={handleSubmitPropuesta}
            />
          )}
        </>
      )}

      {/* Si respondió "sí", preguntar por metas */}
      {acuerdo === "yes" && (
        <div>
          <p>¿Estás de acuerdo con las metas propuestas?</p>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                className={styles.radioInput}
                name={`${id}-metas`}
                value="yes"
                checked={metas === "yes"}
                onChange={() => onMetasChange(id, "yes")}
              />{" "}
              Sí
            </label>
            <label className={styles.radioSpacing}>
              <input
                type="radio"
                className={styles.radioInput}
                name={`${id}-metas`}
                value="no"
                checked={metas === "no"}
                onChange={() => onMetasChange(id, "no")}
              />{" "}
              No
            </label>
          </div>

          {/* Si también respondió "no" a las metas, mostrar campos para nuevas metas */}
          {metas === "no" && (
            <div className={styles.commentArea}>
              <label className={styles.inputLabel}>
                Ingresa tu nueva meta 2028:
                <input
                  type="text"
                  value={comentarios?.meta2028 === "No Aplica" ? "" : (comentarios?.meta2028 || "")}
                  onChange={e =>
                    onComentarioChange(id, "meta2028", e.target.value)
                  }
                  placeholder="Nueva meta para 2028"
                  className={styles.inputField}
                />
              </label>
              <label className={styles.inputLabel}>
                Ingresa tu nueva meta 2040:
                <input
                  type="text"
                  value={comentarios?.meta2040 === "No Aplica" ? "" : (comentarios?.meta2040 || "")}
                  onChange={e =>
                    onComentarioChange(id, "meta2040", e.target.value)
                  }
                  placeholder="Nueva meta para 2040"
                  className={styles.inputField}
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
