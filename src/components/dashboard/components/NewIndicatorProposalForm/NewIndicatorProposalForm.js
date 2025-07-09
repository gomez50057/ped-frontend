import React from "react";
import styles from "./NewIndicatorProposalForm.module.css";
import { NATIONAL_PLAN_AXES, ODS_OBJECTIVES } from "@/utils/indicatorFormOptions";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { FieldArray } from "formik";
import Select from "react-select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const axisOptions = NATIONAL_PLAN_AXES.map(axis => ({ value: axis, label: axis }));
const odsOptions = ODS_OBJECTIVES.map(ods => ({ value: ods, label: ods }));

const validationSchema = Yup.object({
  indicatorName: Yup.string().required("Campo obligatorio"),
  pedAlignment: Yup.string(),
  nationalPlanAlignment: Yup.object().required("Campo obligatorio"),
  odsAlignment: Yup.array().min(1, "Selecciona al menos un ODS"),
  description: Yup.string(),
  periodicity: Yup.string(),
  trend: Yup.string(),
  baseline: Yup.string(),
  goal2028: Yup.string(),
  goal2040: Yup.string(),
  sourceOrganization: Yup.string(),
  sourceUrl: Yup.string().url("Debe ser una URL válida"),
  sources: Yup.array().of(
    Yup.object({
      organization: Yup.string(),
      url: Yup.string().url("Debe ser una URL válida"),
    })
  ),
});

export default function NewIndicatorProposalForm({ onClose, onSubmit, initialData = {} }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Nueva propuesta de indicador</h2>
        <Formik
          initialValues={{
            indicatorName: initialData.indicatorName || "",
            pedAlignment: initialData.pedAlignment || "",
            nationalPlanAlignment: initialData.nationalPlanAlignment
              ? { value: initialData.nationalPlanAlignment, label: initialData.nationalPlanAlignment }
              : null,
            odsAlignment: initialData.odsAlignment
              ? initialData.odsAlignment.map(ods => ({ value: ods, label: ods }))
              : [],
            description: initialData.description || "",
            periodicity: initialData.periodicity || "",
            trend: initialData.trend || "",
            baseline: initialData.baseline || "",
            goal2028: initialData.goal2028 || "",
            goal2040: initialData.goal2040 || "",
            sourceOrganization: initialData.sourceOrganization || "",
            sourceUrl: initialData.sourceUrl || "",
            sources: initialData.sources || [{ organization: "", url: "" }],
          }}
          validationSchema={validationSchema}
          onSubmit={values => {
            const formatted = {
              ...values,
              nationalPlanAlignment: values.nationalPlanAlignment?.value || "",
              odsAlignment: values.odsAlignment?.map(o => o.value) || [],
            };
            onSubmit && onSubmit(formatted);
            onClose && onClose();
          }}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form autoComplete="off">
              <label className={styles.label}>
                Nombre del indicador:
                <Field
                  name="indicatorName"
                  className={styles.input}
                  type="text"
                  required
                />
                <ErrorMessage name="indicatorName" component="div" className={styles.error} />
              </label>
              <label className={styles.label}>
                Alineación al PED:
                <Field name="pedAlignment" className={styles.input} type="text" />
              </label>
              <label className={styles.label}>
                Alineación al Plan Nacional de Desarrollo:
                <Select
                  name="nationalPlanAlignment"
                  classNamePrefix="react-select"
                  className={styles.reactSelect}
                  value={values.nationalPlanAlignment}
                  options={axisOptions}
                  placeholder="Selecciona una opción"
                  onChange={option => setFieldValue("nationalPlanAlignment", option)}
                  isClearable
                />
                {errors.nationalPlanAlignment && touched.nationalPlanAlignment && (
                  <div className={styles.error}>{errors.nationalPlanAlignment}</div>
                )}
              </label>
              <label className={styles.label}>
                Alineación a ODS:
                <Select
                  name="odsAlignment"
                  classNamePrefix="react-select"
                  className={styles.reactSelect}
                  value={values.odsAlignment}
                  options={odsOptions}
                  isMulti
                  placeholder="Selecciona uno o varios"
                  onChange={options => setFieldValue("odsAlignment", options)}
                />
                {errors.odsAlignment && touched.odsAlignment && (
                  <div className={styles.error}>{errors.odsAlignment}</div>
                )}
              </label>
              <label className={styles.label}>
                Descripción:
                <Field
                  name="description"
                  className={styles.textarea}
                  as="textarea"
                />
              </label>
              <label className={styles.label}>
                Periodicidad:
                <Field name="periodicity" className={styles.input} type="text" />
              </label>
              <label className={styles.label}>
                Sentido del indicador:
                <Field
                  name="trend"
                  className={styles.input}
                  type="text"
                  placeholder="Ejemplo: Ascendente"
                />
              </label>
              <label className={styles.label}>
                Línea base:
                <Field
                  name="baseline"
                  className={styles.input}
                  type="text"
                  placeholder="Ejemplo: 2023: 19ª Posición"
                />
              </label>
              <label className={styles.label}>
                Meta 2028:
                <Field name="goal2028" className={styles.input} type="text" />
              </label>
              <label className={styles.label}>
                Meta 2040:
                <Field name="goal2040" className={styles.input} type="text" />
              </label>

              <div className={styles.sectionTitle} style={{ marginBottom: "0.3rem", display: "flex", alignItems: "center" }}>
                Fuente:
                <FieldArray name="sources">
                  {({ push, remove, form }) => (
                    <>
                      <AddCircleOutlineIcon
                        className={styles.addIcon}
                        style={{ marginLeft: 8, cursor: "pointer" }}
                        onClick={() => push({ organization: "", url: "" })}
                        titleAccess="Agregar otra fuente"
                      />
                    </>
                  )}
                </FieldArray>
              </div>

              <FieldArray name="sources">
                {({ remove, push }) => (
                  <>
                    {values.sources.map((source, idx) => (
                      <div className={styles.flexRow} key={idx}>
                        <label className={styles.label} style={{ flex: 1 }}>
                          Organización:
                          <Field
                            name={`sources[${idx}].organization`}
                            className={styles.input}
                            type="text"
                          />
                        </label>
                        <label className={styles.label} style={{ flex: 1, marginLeft: "1.2rem" }}>
                          URL:
                          <Field
                            name={`sources[${idx}].url`}
                            className={styles.input}
                            type="text"
                            placeholder="https://..."
                          />
                          <ErrorMessage name={`sources[${idx}].url`} component="div" className={styles.error} />
                        </label>
                        {/* Eliminar si hay más de uno */}
                        {values.sources.length > 1 && (
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => remove(idx)}
                            title="Eliminar esta fuente"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </FieldArray>


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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
