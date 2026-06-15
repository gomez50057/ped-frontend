"use client";

import { Filter, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SeguimientoShell from "@/components/seguimiento-actividades/SeguimientoShell";
import ActivityTable from "@/components/seguimiento-actividades/activities/ActivityTable";
import ExtensionModal from "@/components/seguimiento-actividades/activities/ExtensionModal";
import { ACTIVITY_STATUS, PRIORITIES } from "@/components/seguimiento-actividades/lib/constants";
import { canManageActivities } from "@/components/seguimiento-actividades/lib/permissions";
import Button from "@/components/seguimiento-actividades/ui/Button";
import Input from "@/components/seguimiento-actividades/ui/Input";
import Select from "@/components/seguimiento-actividades/ui/Select";
import {
  createExtension,
  fetchMe,
  getActivities,
  getAssignableUsers,
  getProjects,
} from "@/services/seguimientoActividades";
import styles from "./ActivitiesPage.module.css";

const BASE_PATH = "/seguimiento-actividades";

export default function SeguimientoActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    assigned_to: "",
    project: "",
    status: "",
    due_date: "",
    priority: "",
    search: "",
  });
  const [selected, setSelected] = useState(null);

  async function loadCatalogs() {
    const [userData, projectData] = await Promise.all([
      getAssignableUsers().catch(() => []),
      getProjects().catch(() => []),
    ]);
    setUsers(userData);
    setProjects(projectData);
  }

  async function loadActivities() {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const data = await getActivities(params);
    setActivities(data);
  }

  useEffect(() => {
    loadCatalogs();
    fetchMe().then(setCurrentUser).catch(() => {});
  }, []);

  useEffect(() => {
    loadActivities().catch(() => {});
  }, [filters]);

  async function handleExtension(payload) {
    await createExtension(selected.id, payload);
    setSelected(null);
    await loadActivities();
  }

  function setFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <SeguimientoShell>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Actividades</h1>
          <p className="pageSubtitle">Consulta, filtra y da seguimiento a actividades asignadas.</p>
        </div>
        {canManageActivities(currentUser) ? (
          <Link href={`${BASE_PATH}/actividades/nueva`}>
            <Button icon={Plus}>Nueva actividad</Button>
          </Link>
        ) : null}
      </div>

      <section className={styles.filters}>
        <div className={styles.filterTitle}>
          <Filter size={18} />
          <strong>Filtros</strong>
        </div>
        <Select label="Responsable" value={filters.assigned_to} onChange={(event) => setFilter("assigned_to", event.target.value)}>
          <option value="">Todos</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name || user.username}
            </option>
          ))}
        </Select>
        <Select label="Proyecto" value={filters.project} onChange={(event) => setFilter("project", event.target.value)}>
          <option value="">Todos</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
        <Select label="Estado" value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>
          <option value="">Todos</option>
          {Object.entries(ACTIVITY_STATUS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Input label="Fecha final" type="date" value={filters.due_date} onChange={(event) => setFilter("due_date", event.target.value)} />
        <Select label="Prioridad" value={filters.priority} onChange={(event) => setFilter("priority", event.target.value)}>
          <option value="">Todas</option>
          {Object.entries(PRIORITIES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Input label="Búsqueda" value={filters.search} onChange={(event) => setFilter("search", event.target.value)} placeholder="Título u observación" />
      </section>

      <ActivityTable activities={activities} currentUser={currentUser} onExtend={setSelected} />
      <ExtensionModal open={Boolean(selected)} activity={selected} onClose={() => setSelected(null)} onSave={handleExtension} />
    </SeguimientoShell>
  );
}
