"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SeguimientoShell from "@/components/seguimiento-actividades/SeguimientoShell";
import ActivityForm from "@/components/seguimiento-actividades/activities/ActivityForm";
import { canManageActivities } from "@/components/seguimiento-actividades/lib/permissions";
import {
  createActivity,
  fetchMe,
  getAssignableUsers,
  getProjects,
} from "@/services/seguimientoActividades";

const BASE_PATH = "/seguimiento-actividades";

export default function NewSeguimientoActivityPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMe().then((user) => {
      if (!canManageActivities(user)) return;
      Promise.all([
        getAssignableUsers().catch(() => []),
        getProjects().catch(() => []),
      ]).then(([userData, projectData]) => {
        setUsers(userData);
        setProjects(projectData);
      });
    });
  }, []);

  async function handleSubmit(payload) {
    if (!users.length) return;
    setSaving(true);
    try {
      const activity = await createActivity(payload);
      router.push(`${BASE_PATH}/actividades/${activity.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SeguimientoShell canAccess={canManageActivities}>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Nueva actividad</h1>
          <p className="pageSubtitle">Registra una actividad asignada a un responsable.</p>
        </div>
      </div>
      <ActivityForm users={users} projects={projects} onSubmit={handleSubmit} saving={saving} />
    </SeguimientoShell>
  );
}
