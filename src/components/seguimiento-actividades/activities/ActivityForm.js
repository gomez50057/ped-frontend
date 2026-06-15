"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { confirmAction } from "../lib/confirmations";
import { PRIORITIES } from "../lib/constants";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
import styles from "./ActivityForm.module.css";

const initialState = {
  title: "",
  description: "",
  project: "",
  assigned_to: "",
  start_date: "",
  due_date: "",
  priority: "medium",
  general_observations: ""
};

function FieldLabel({ children, required }) {
  const tooltip = required ? "Campo obligatorio" : "Campo opcional";

  return (
    <span className={styles.labelText}>
      <span
        className={styles.fieldMarker}
        aria-label={tooltip}
        role="img"
        tabIndex="0"
        onClick={(event) => event.currentTarget.focus()}
      >
        <svg
          className={required ? styles.requiredIcon : styles.optionalIcon}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M5.5 2.25h5.25L15.5 7v10.75h-11V2.25h1zm5 1.75v3.25h3.25L10.5 4z" />
          <path d="M7 10.2h6v1.35H7V10.2zm0 3h4.2v1.35H7V13.2z" />
          {required ? <path d="M14.65 13.35h1.7v1.7h-1.7v-1.7zm.15-5.1h1.4l-.15 4.15h-1.1l-.15-4.15z" /> : <path d="M13.85 13.65l1.05-1.05.95.95 1.85-1.85 1.05 1.05-2.9 2.9-2-2z" />}
        </svg>
        <span className={styles.tooltip} role="tooltip" aria-hidden="true">
          {tooltip}
        </span>
      </span>
      {children}
    </span>
  );
}

export default function ActivityForm({ users = [], projects = [], initialValues, onSubmit, saving }) {
  const [form, setForm] = useState({ ...initialState, ...initialValues });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const accepted = await confirmAction({
      title: "Guardar actividad",
      message: "Revisa que el responsable, fechas y prioridad sean correctos antes de guardar.",
      confirmLabel: "Guardar",
      tone: "success"
    });
    if (!accepted) return;
    const payload = {
      ...form,
      assigned_to: Number(form.assigned_to),
      project: form.project ? Number(form.project) : null,
      start_date: form.start_date || null,
      due_date: form.due_date || null
    };
    onSubmit(payload);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label={<FieldLabel required>Titulo de actividad</FieldLabel>}
        value={form.title}
        onChange={(event) => update("title", event.target.value)}
        required
      />
      <Textarea
        label={<FieldLabel>Descripcion</FieldLabel>}
        value={form.description}
        onChange={(event) => update("description", event.target.value)}
      />
      <div className={styles.grid}>
        <Select
          label={<FieldLabel>Proyecto</FieldLabel>}
          value={form.project || ""}
          onChange={(event) => update("project", event.target.value)}
        >
          <option value="">Sin proyecto</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
        <Select
          label={<FieldLabel required>Responsable</FieldLabel>}
          value={form.assigned_to || ""}
          onChange={(event) => update("assigned_to", event.target.value)}
          required
        >
          <option value="">Selecciona responsable</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name || user.username} · {user.role}
            </option>
          ))}
        </Select>
      </div>
      <div className={styles.grid}>
        <Input
          label={<FieldLabel>Fecha de inicio</FieldLabel>}
          type="date"
          value={form.start_date || ""}
          onChange={(event) => update("start_date", event.target.value)}
        />
        <Input
          label={<FieldLabel>Fecha propuesta de entrega</FieldLabel>}
          type="date"
          value={form.due_date || ""}
          onChange={(event) => update("due_date", event.target.value)}
        />
        <Select
          label={<FieldLabel>Prioridad</FieldLabel>}
          value={form.priority}
          onChange={(event) => update("priority", event.target.value)}
        >
          {Object.entries(PRIORITIES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <Textarea
        label={<FieldLabel>Observaciones generales</FieldLabel>}
        value={form.general_observations}
        onChange={(event) => update("general_observations", event.target.value)}
      />
      <div className={styles.actions}>
        <Button type="submit" icon={Save} disabled={saving}>
          {saving ? "Guardando..." : "Guardar actividad"}
        </Button>
      </div>
    </form>
  );
}
