"use client";

import { useCallback, useEffect, useState } from "react";
import SeguimientoShell from "@/components/seguimiento-actividades/SeguimientoShell";
import ActivityTable from "@/components/seguimiento-actividades/activities/ActivityTable";
import ExtensionModal from "@/components/seguimiento-actividades/activities/ExtensionModal";
import DashboardCards from "@/components/seguimiento-actividades/dashboard/DashboardCards";
import Select from "@/components/seguimiento-actividades/ui/Select";
import {
  createExtension,
  fetchMe,
  getActivities,
  getAssignableUsers,
  getDashboardSummary,
} from "@/services/seguimientoActividades";
import styles from "./DashboardPage.module.css";

export default function SeguimientoDashboardPage() {
  const [summary, setSummary] = useState({});
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");

  const loadData = useCallback(async (userId = assignedTo) => {
    const params = userId ? { assigned_to: userId } : {};
    const [summaryData, activityData] = await Promise.all([
      getDashboardSummary(params),
      getActivities({ ...params, ordering: "-updated_at" }),
    ]);
    setSummary(summaryData);
    setActivities(activityData.slice(0, 8));
  }, [assignedTo]);

  useEffect(() => {
    fetchMe().then(setCurrentUser).catch(() => {});
    getAssignableUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    loadData(assignedTo).catch(() => {});
  }, [assignedTo, loadData]);

  async function handleExtension(payload) {
    await createExtension(selected.id, payload);
    setSelected(null);
    await loadData();
  }

  return (
    <SeguimientoShell>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Resumen</h1>
          <p className="pageSubtitle">Indicadores base y últimas actividades modificadas.</p>
        </div>
        {users.length ? (
          <Select
            className={styles.userFilter}
            label="Filtrar por usuario"
            value={assignedTo}
            onChange={(event) => setAssignedTo(event.target.value)}
          >
            <option value="">Todos los usuarios</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name || user.username} · {user.role}
              </option>
            ))}
          </Select>
        ) : null}
      </div>
      <DashboardCards summary={summary} />
      <section className={styles.recent}>
        <h2>Seguimiento reciente</h2>
        <ActivityTable activities={activities} currentUser={currentUser} onExtend={setSelected} />
      </section>
      <ExtensionModal
        open={Boolean(selected)}
        activity={selected}
        onClose={() => setSelected(null)}
        onSave={handleExtension}
      />
    </SeguimientoShell>
  );
}

