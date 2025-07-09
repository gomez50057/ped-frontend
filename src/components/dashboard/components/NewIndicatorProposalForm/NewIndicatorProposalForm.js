import React, { useState } from "react";
import styles from "./NewIndicatorProposalForm.module.css";
import { NATIONAL_PLAN_AXES, ODS_OBJECTIVES } from "@/utils/indicatorFormOptions";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { FieldArray } from "formik";
import Select from "react-select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "@/components/dashboard/components/ConfirmDialog/ConfirmDialog";

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
  sources: Yup.array().of(
    Yup.object({
      organization: Yup.string(),
      url: Yup.string().url("Debe ser una URL válida"),
    })
  ),
});

export default function NewIndicatorProposalForm({ onClose, onSubmit, initialData = {} }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(s => ({ ...s, open: false }));
  };

  const handleCancel = () => {
    setSnackbar({
      open: true,
      message: "Propuesta cancelada",
      severity: "warning",
    });
    setTimeout(() => {
      onClose && onClose();
    }, 1200);
  };

  return (
    <>
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
              sources: initialData.sources || [{ organization: "", url: "" }],
            }}
            validationSchema={validationSchema}
            onSubmit={async values => {
              setPendingValues(values);
              setConfirmOpen(true);
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
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <ConfirmDialog
          open={confirmOpen}
          title="¿Estás seguro de que quieres guardar esta nueva propuesta de indicador?"
          confirmText="Sí, guardar"
          cancelText="Cancelar"
          onClose={() => {
            setConfirmOpen(false);
            setSnackbar({
              open: true,
              message: "Acción cancelada por el usuario",
              severity: "warning"
            });
          }}
          onConfirm={async () => {
            setConfirmOpen(false);
            if (pendingValues) {
              try {
                const formatted = {
                  ...pendingValues,
                  nationalPlanAlignment: pendingValues.nationalPlanAlignment?.value || "",
                  odsAlignment: pendingValues.odsAlignment?.map(o => o.value) || [],
                };
                await onSubmit?.(formatted);
                setSnackbar({
                  open: true,
                  message: "Propuesta guardada correctamente",
                  severity: "success",
                });
                setTimeout(() => {
                  onClose && onClose();
                }, 800);
              } catch (error) {
                setSnackbar({
                  open: true,
                  message: "Error al guardar la propuesta. Intenta de nuevo.",
                  severity: "error",
                });
              }
            }
          }}
        />
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>


    </>

  );
}
