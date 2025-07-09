import React, { useState } from "react";
import styles from "./NewIndicatorProposalForm.module.css";
import { NATIONAL_PLAN_AXES, ODS_OBJECTIVES } from "@/utils/indicatorFormOptions";

export default function NewIndicatorProposalForm({ onClose, onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    indicatorName: initialData.indicatorName || "",
    pedAlignment: initialData.pedAlignment || "",
    nationalPlanAlignment: initialData.nationalPlanAlignment || "",
    odsAlignment: initialData.odsAlignment || "",
    description: initialData.description || "",
    periodicity: initialData.periodicity || "",
    trend: initialData.trend || "",
    baseline: initialData.baseline || "",
    goal2028: initialData.goal2028 || "",
    goal2040: initialData.goal2040 || "",
    source: initialData.source || "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Puedes agregar validaciones aquí antes de enviar
    onSubmit && onSubmit(form);
    onClose && onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Nueva propuesta de indicador</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <label className={styles.label}>
            Nombre del indicador:
            <input
              type="text"
              name="indicatorName"
              className={styles.input}
              value={form.indicatorName}
              onChange={handleChange}
              required
            />
          </label>
          <label className={styles.label}>
            Alineación al PED:
            <input
              type="text"
              name="pedAlignment"
              className={styles.input}
              value={form.pedAlignment}
              onChange={handleChange}
            />
          </label>
          <label className={styles.label}>
            Alineación al Plan Nacional de Desarrollo:
            <select
              name="nationalPlanAlignment"
              className={styles.input}
              value={form.nationalPlanAlignment}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una opción</option>
              {NATIONAL_PLAN_AXES.map(axis => (
                <option key={axis} value={axis}>
                  {axis}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Alineación a ODS:
            <select
              name="odsAlignment"
              className={styles.input}
              multiple
              value={form.odsAlignment}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setForm(prev => ({ ...prev, odsAlignment: selected }));
              }}
              size={5} // Muestra 5 elementos a la vez (ajusta si quieres)
            >
              {ODS_OBJECTIVES.map((ods, idx) => (
                <option key={ods} value={ods}>
                  {ods}
                </option>
              ))}
            </select>
            <small className={styles.hint}>Usa Ctrl/Cmd para seleccionar varios</small>
          </label>
          <label className={styles.label}>
            Descripción:
            <textarea
              name="description"
              className={styles.textarea}
              value={form.description}
              onChange={handleChange}
            />
          </label>
          <label className={styles.label}>
            Periodicidad:
            <input
              type="text"
              name="periodicity"
              className={styles.input}
              value={form.periodicity}
              onChange={handleChange}
            />
          </label>
          <label className={styles.label}>
            Sentido del indicador:
            <input
              type="text"
              name="trend"
              className={styles.input}
              value={form.trend}
              onChange={handleChange}
              placeholder="Ejemplo: Ascendente"
            />
          </label>
          <label className={styles.label}>
            Línea base:
            <input
              type="text"
              name="baseline"
              className={styles.input}
              value={form.baseline}
              onChange={handleChange}
              placeholder="Ejemplo: 2023: 19ª Posición"
            />
          </label>
          <label className={styles.label}>
            Meta 2028:
            <input
              type="text"
              name="goal2028"
              className={styles.input}
              value={form.goal2028}
              onChange={handleChange}
            />
          </label>
          <label className={styles.label}>
            Meta 2040:
            <input
              type="text"
              name="goal2040"
              className={styles.input}
              value={form.goal2040}
              onChange={handleChange}
            />
          </label>
          <label className={styles.label}>
            Fuente:
            <input
              type="text"
              name="source"
              className={styles.input}
              value={form.source}
              onChange={handleChange}
            />
          </label>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton}>
              Guardar propuesta
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
