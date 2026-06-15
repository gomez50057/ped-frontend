"use client";

import { Ban, FolderPlus, Pencil, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import SeguimientoShell from "@/components/seguimiento-actividades/SeguimientoShell";
import { confirmAction } from "@/components/seguimiento-actividades/lib/confirmations";
import { canManageProjects, canViewProjectsTab } from "@/components/seguimiento-actividades/lib/permissions";
import Button from "@/components/seguimiento-actividades/ui/Button";
import Input from "@/components/seguimiento-actividades/ui/Input";
import Select from "@/components/seguimiento-actividades/ui/Select";
import Textarea from "@/components/seguimiento-actividades/ui/Textarea";
import {
  createProject,
  fetchMe,
  getProjects,
  updateProject,
} from "@/services/seguimientoActividades";
import styles from "./ProjectsPage.module.css";

const emptyForm = { name: "", description: "", status: "active" };
const statusLabels = {
  active: "Activo",
  inactive: "Cancelado",
  archived: "Archivado",
};

export default function SeguimientoProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  async function loadProjects() {
    setProjects(await getProjects());
  }

  useEffect(() => {
    fetchMe().then((user) => {
      setCurrentUser(user);
      if (canViewProjectsTab(user)) {
        loadProjects();
      }
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const accepted = await confirmAction({
      title: editingId ? "Guardar proyecto" : "Crear proyecto",
      message: editingId
        ? "Se actualizarán los datos y el estatus del proyecto seleccionado."
        : "Se creará un nuevo proyecto para agrupar actividades.",
      confirmLabel: editingId ? "Guardar" : "Crear",
      tone: "success",
    });
    if (!accepted) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateProject(editingId, form);
      } else {
        await createProject(form);
      }
      resetForm();
      await loadProjects();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description || "",
      status: project.status,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function cancelProject(project) {
    const accepted = await confirmAction({
      title: "Cancelar proyecto",
      message: "El proyecto no se eliminará; solo cambiará su estatus a Cancelado.",
      confirmLabel: "Cancelar proyecto",
      tone: "danger",
    });
    if (!accepted) return;
    await updateProject(project.id, { status: "inactive" });
    await loadProjects();
    if (editingId === project.id) {
      resetForm();
    }
  }

  return (
    <SeguimientoShell canAccess={canViewProjectsTab}>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Proyectos</h1>
          <p className="pageSubtitle">Líneas de trabajo para agrupar actividades institucionales.</p>
        </div>
      </div>
      <div className={styles.layout}>
        {canManageProjects(currentUser) ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>{editingId ? "Editar proyecto" : "Nuevo proyecto"}</h2>
            <Input label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <Textarea label="Descripción" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <Select label="Estado" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="active">Activo</option>
              <option value="inactive">Cancelado</option>
              <option value="archived">Archivado</option>
            </Select>
            <div className={styles.formActions}>
              <Button type="submit" icon={editingId ? Save : FolderPlus} disabled={saving}>
                {editingId ? "Guardar cambios" : "Crear proyecto"}
              </Button>
              {editingId ? (
                <Button type="button" variant="secondary" icon={X} onClick={resetForm}>
                  Cancelar edición
                </Button>
              ) : null}
            </div>
          </form>
        ) : null}
        <section className={styles.list}>
          {projects.map((project) => (
            <article key={project.id} className={styles.project}>
              <div>
                <h2>{project.name}</h2>
                <p>{project.description || "Sin descripción."}</p>
              </div>
              <div className={styles.projectMeta}>
                <span>{statusLabels[project.status] || project.status}</span>
                {canManageProjects(currentUser) ? (
                  <div className={styles.projectActions}>
                    <Button type="button" size="sm" variant="secondary" icon={Pencil} onClick={() => startEdit(project)}>
                      Editar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      icon={Ban}
                      disabled={project.status === "inactive"}
                      onClick={() => cancelProject(project)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </SeguimientoShell>
  );
}

