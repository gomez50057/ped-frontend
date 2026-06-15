"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import SeguimientoShell from "@/components/seguimiento-actividades/SeguimientoShell";
import ActivityDetail from "@/components/seguimiento-actividades/activities/ActivityDetail";
import ActivityForm from "@/components/seguimiento-actividades/activities/ActivityForm";
import ExtensionModal from "@/components/seguimiento-actividades/activities/ExtensionModal";
import { confirmAction } from "@/components/seguimiento-actividades/lib/confirmations";
import Modal from "@/components/seguimiento-actividades/ui/Modal";
import {
  addBossObservation,
  addComment,
  createExtension,
  deleteBossObservation,
  fetchMe,
  getActivity,
  getAssignableUsers,
  getProjects,
  updateActivity,
  updateBossObservation,
} from "@/services/seguimientoActividades";

export default function SeguimientoActivityDetailPage() {
  const params = useParams();
  const id = params.id;
  const [activity, setActivity] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [extensionOpen, setExtensionOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadActivity() {
    const data = await getActivity(id);
    setActivity(data);
  }

  useEffect(() => {
    Promise.all([
      loadActivity(),
      fetchMe().then(setCurrentUser),
      getAssignableUsers().then(setUsers).catch(() => []),
      getProjects().then(setProjects).catch(() => []),
    ]).catch(() => {});
  }, [id]);

  async function reloadAfter(action) {
    await action();
    await loadActivity();
  }

  async function handleExtension(payload) {
    if (activity?.status === "completed") return;
    await reloadAfter(() => createExtension(id, payload));
    setExtensionOpen(false);
  }

  async function handleEdit(payload) {
    if (activity?.status === "completed") return;
    setSaving(true);
    try {
      await updateActivity(id, { ...payload, change_reason: "Actualización desde detalle" });
      setEditOpen(false);
      await loadActivity();
    } finally {
      setSaving(false);
    }
  }

  return (
    <SeguimientoShell>
      <ActivityDetail
        activity={activity}
        currentUser={currentUser}
        onEdit={() => setEditOpen(true)}
        onExtend={() => setExtensionOpen(true)}
        onComplete={async () => {
          const accepted = await confirmAction({
            title: "Concluir actividad",
            message: "Al marcarla como concluida ya no podrá editarse, aplazarse ni recibir comentarios.",
            confirmLabel: "Concluir",
            tone: "warning",
          });
          if (!accepted) return;
          await reloadAfter(() => updateActivity(id, { status: "completed", change_reason: "Actividad concluida" }));
        }}
        onAddComment={(comment) => reloadAfter(() => addComment(id, comment))}
        onAddBossObservation={(observation) => reloadAfter(() => addBossObservation(id, observation))}
        onUpdateBossObservation={(observationId, observation) =>
          reloadAfter(() => updateBossObservation(observationId, observation))
        }
        onDeleteBossObservation={(observationId) => reloadAfter(() => deleteBossObservation(observationId))}
      />
      <ExtensionModal
        open={extensionOpen}
        activity={activity}
        onClose={() => setExtensionOpen(false)}
        onSave={handleExtension}
      />
      <Modal open={editOpen} title="Editar actividad" onClose={() => setEditOpen(false)}>
        <ActivityForm
          users={users}
          projects={projects}
          initialValues={{
            title: activity?.title || "",
            description: activity?.description || "",
            project: activity?.project || "",
            assigned_to: activity?.assigned_to || "",
            start_date: activity?.start_date || "",
            due_date: activity?.due_date || "",
            priority: activity?.priority || "medium",
            general_observations: activity?.general_observations || "",
          }}
          onSubmit={handleEdit}
          saving={saving}
        />
      </Modal>
    </SeguimientoShell>
  );
}

